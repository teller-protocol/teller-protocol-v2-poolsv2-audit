import { DeployFunction } from 'hardhat-deploy/dist/types'

import { logTxLink } from 'helpers/logTxLink'


const deployFn: DeployFunction = async (hre) => {
  hre.log('----------')
  hre.log('')
  hre.log('  --- RUNNING DEPLOYMENT VALIDATIONS ---  ')

  const tellerV2 = await hre.contracts.get('TellerV2')
 
  const marketRegistry = await hre.contracts.get('MarketRegistry')

  	

  
  const pausingManager = await hre.contracts.get(
    'ProtocolPausingManager'
  )
  
  const lenderGroupsFactory = await hre.contracts.get(
    'LenderCommitmentGroupFactory'
  )

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
 





  const lenderGroupsFactoryOwner = await lenderGroupsFactory.owner()

  if (lenderGroupsFactoryOwner == zeroAddress) {
  	throw "Validation Error : lenderGroupsFactoryOwner not defined " 
  }



  hre.log( " ------- "  )
  hre.log( "lenderGroupsFactoryOwner: "  )
  hre.log(  lenderGroupsFactoryOwner  )
  hre.log( " ------- "  )
 





  const tellerV2Owner = await tellerV2.owner()

  if (tellerV2Owner == zeroAddress) {
  	throw "Validation Error : Teller Owner not defined " 
  }



  hre.log( " ------- "  )
  hre.log( "tellerV2Owner: "  )
  hre.log(  tellerV2Owner  )
  hre.log( " ------- "  )
 




  const tellerV2PausingManager = await tellerV2.getProtocolPausingManager()

  if (tellerV2PausingManager == zeroAddress) {
  	throw "Validation Error : Teller Protocol Pausing Manager not defined " 
  }



  hre.log( " ------- "  )
  hre.log( "tellerV2PausingManager: "  )
  hre.log(  tellerV2PausingManager  )
  hre.log( " ------- "  )
 





  const pausingManagerOwner = await pausingManager.owner()

  if (pausingManagerOwner == zeroAddress) {
  	throw "Validation Error :  Pausing Manager Owner not defined " 
  }



  hre.log( " ------- "  )
  hre.log( "pausingManagerOwner: "  )
  hre.log(  pausingManagerOwner  )
  hre.log( " ------- "  )
 
 


  hre.log(' ---  DEPLOYMENT VALIDATIONS FINISHED ---  ')
 

  return true
}

// tags and deployment
deployFn.id = 'validate-deployments'
deployFn.tags = ['proposal', 'upgrade', 'validate-deployments']
deployFn.dependencies = ['lender-groups:upgrade']
deployFn.skip = async (hre) => {
   
  return !hre.network.live || !['sepolia','polygon','base','arbitrum','mainnet' ].includes(hre.network.name)
}
export default deployFn

