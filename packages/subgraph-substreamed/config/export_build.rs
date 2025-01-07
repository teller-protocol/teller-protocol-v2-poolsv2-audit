use handlebars::Handlebars;
use serde::Serialize;
use std::collections::HashMap;
use std::fs::{self, File};
use std::io::{self, Read, Write};

#[derive(Serialize)]
struct Data {
    network: String,
    start_block: u32 ,
   
}

impl Default for Data {

	fn default() -> Self {

		Self {

			network: "arbitrum",
			start_block: "500"
		}

	}

}

// Function to load the template file content
fn load_template(file_path: &str) -> io::Result<String> {
    let mut file = File::open(file_path)?;
    let mut content = String::new();
    file.read_to_string(&mut content)?;
    Ok(content)
}

// Function to process the template and data
fn process_template(template: &str, data: &Data) -> String {
    let mut handlebars = Handlebars::new();
    let rendered = handlebars.render_template(template, &data).unwrap();
    rendered
}

// Function to process files and replace placeholders
fn process_file(file_path: &str, data: &Data) -> io::Result<()> {
    let template = load_template(file_path)?;
    let updated_content = process_template(&template, &data);

    // Write the updated content back to the file
    let mut file = File::create(file_path)?;
    file.write_all(updated_content.as_bytes())?;
    println!("File processed: {}", file_path);
    Ok(())
}

fn main() -> io::Result<()> {
    // Define the data to be injected into the template
    let data = Data::default();


    let input_dir = "./build_inputs";
    let output_dir = "../";

	 if !Path::new(output_dir).exists() {
        fs::create_dir_all(output_dir)?;
    }

    // Process all files in the input directory
    process_files_in_directory(input_dir, output_dir, &data)?;



    Ok(())
}



fn process_files_in_directory(input_dir: &str, output_dir: &str, data: &Data) -> io::Result<()> {
    // Read all files from the input directory
    let entries = fs::read_dir(input_dir)?;

    for entry in entries {
        let entry = entry?;
        let path = entry.path();

        if path.is_file() {
            let input_file = path.to_str().unwrap();
            let file_name = path.file_name().unwrap().to_str().unwrap();
            let output_file = Path::new(output_dir).join(file_name);

            process_file(input_file, output_file.to_str().unwrap(), data)?;
        }
    }

    Ok(())
}