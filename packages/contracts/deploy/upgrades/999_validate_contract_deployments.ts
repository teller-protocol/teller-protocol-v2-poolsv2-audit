import { DeployFunction } from 'hardhat-deploy/dist/types'

import { logTxLink } from 'helpers/logTxLink'


const deployFn: DeployFunction = async (hre) => {
  hre.log('----------')
  hre.log('')
  hre.log('  --- RUNNING DEPLOYMENT VALIDATIONS ---  ')

  const tellerV2 = await hre.contracts.get('TellerV2')
 
  const marketRegistry = await hre.contracts.get('MarketRegistry')

  
  const smartCommitmentForwarder = await hre.contracts.get(
    'SmartCommitmentForwarder'
  )
 


  //make sure the SCF has been initialized  and has an owner 

  //make sure tellerV2 has been re-initialized  and has a pausing manager 

  //make sure lender groups factory has been initialized and has an owner 

  const zeroAddress = "0x0000000000000000000000000000000000000000";

  const scfOwner = await smartCommitmentForwarder.owner()

  if (scfOwner == zeroAddress) {
  	throw "Validation Error : SCF owner not defined " 
  }
  
  hre.log( " ------- "  )
  hre.log( "SCF owner: "  )
  hre.log(  scfOwner  )
  hre.log( " ------- "  )
 



  const tellerV2PausingManager = await tellerV2.getProtocolPausingManager()

  if (tellerV2PausingManager == zeroAddress) {
  	throw "Validation Error : Teller Protocol Pausing Manager not defined " 
  }



  hre.log( " ------- "  )
  hre.log( "tellerV2PausingManager: "  )
  hre.log(  tellerV2PausingManager  )
  hre.log( " ------- "  )
 


  
/*
  await hre.upgrades.proposeBatchTimelock({
    title: 'Smart Commitment Forwarder: Upgrade Oracle Logic 2',
    description: ` 
# Smart Commitment Forwarder
* Modifies Smart Commitment Forwarder to change oracle security logic.
`,
    _steps: [
      {
        proxy: smartCommitmentForwarder,
        implFactory: await hre.ethers.getContractFactory(
          'SmartCommitmentForwarder'
        ),

        opts: {
          unsafeAllow: ['constructor', 'state-variable-immutable'],
          // unsafeAllowRenames: true,
          // unsafeSkipStorageCheck: true, //caution !
          constructorArgs: [
            await tellerV2.getAddress(),
            await marketRegistry.getAddress(),
          ],
            initializer : "initialize" 

         
           
        },
      },
    ],
  })*/




  hre.log(' ---  DEPLOYMENT VALIDATIONS FINISHED ---  ')
 

  return true
}

// tags and deployment
deployFn.id = 'validate-deployments'
deployFn.tags = ['proposal', 'upgrade', 'validate-deployments']
deployFn.dependencies = ['smart-commitment-forwarder:deploy']
deployFn.skip = async (hre) => {
  
  //only had to do this on polygon once 
  return !hre.network.live || !['sepolia','polygon' ].includes(hre.network.name)
}
export default deployFn

