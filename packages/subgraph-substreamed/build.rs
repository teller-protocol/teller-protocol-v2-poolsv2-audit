use anyhow::{Ok, Result};
use regex::Regex;
use substreams_ethereum::Abigen;
use std::fs;

fn main() -> Result<(), anyhow::Error> {
    let file_names = [
        "abi/factory_contract.abi.json",
        "abi/lendergroup_contract.abi.json",
        "abi/collateral_manager.abi.json",
    ];
    let file_output_names = [
        "src/abi/factory_contract.rs",
        "src/abi/lendergroup_contract.rs",
        "src/abi/collateral_manager.rs",
    ];

    let mut i = 0;
    for f in file_names {
        let contents = fs::read_to_string(f)
            .expect("Should have been able to read the file");

        // sanitize fields and attributes starting with an underscore
        let regex = Regex::new(r#"("\w+"\s?:\s?")_(\w+")"#).unwrap();
        let sanitized_abi_file = regex.replace_all(contents.as_str(), "${1}u_${2}");

        Abigen::from_bytes("Contract", sanitized_abi_file.as_bytes())?
            .generate()?
            .write_to_file(file_output_names[i])?;

        i = i+1;
    }

    Ok(())
}
