use std::path::Path;
use handlebars::Handlebars;
use serde::Serialize;
use std::collections::HashMap;
use std::fs::{self, File};
use std::io::{self, Read, Write};

#[derive(Serialize)]
struct Data {
    graph_network: String,
    chain_network: String ,
    start_block: u32 ,
   
}

impl Default for Data {

	fn default() -> Self {

		Self {
			graph_network: "arbitrum".to_string(),  //polygon
			chain_network: "arbitrum".to_string(),   // matic 
			start_block:  292978933     // 66108200 on polygon 
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

// Function to process a single file and write output to the output folder
fn process_file(input_file: &str, output_file: &str, data: &Data) -> io::Result<()> {
    let template = load_template(input_file)?;
    let updated_content = process_template(&template, &data);

    // Write the updated content to the output file
    let mut file = File::create(output_file)?;
    file.write_all(updated_content.as_bytes())?;
    println!("File processed: {} -> {}", input_file, output_file);
    Ok(())
}


fn main() -> io::Result<()> {
    // Define the data to be injected into the template
    let data = Data::default();


    let input_folder = "./config/build_inputs";
    let output_folder = "./";

	println!("Input folder: {}", input_folder);
    println!("Output folder: {}", output_folder);

    // Check if input folder exists
    if !Path::new(input_folder).exists() {
        eprintln!("Error: Input folder '{}' does not exist.", input_folder);
        std::process::exit(1);
    }

    // Ensure the output directory exists
    if !Path::new(output_folder).exists() {
        println!("Output folder does not exist. Creating it...");
        fs::create_dir_all(output_folder).expect("Failed to create output folder");
    }

    // Process all files in the input directory
    process_files_in_directory(input_folder, output_folder, &data)?;



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