import { DeployFunction } from 'hardhat-deploy/dist/types'

const deployFn: DeployFunction = async (hre) => {
  hre.log('----------')
  hre.log('')
  hre.log('Lendergroups: Proposing upgrade...')



  const lenderCommitmentGroupBeaconProxy = await hre.contracts.get('LenderCommitmentGroupBeacon')

  const tellerV2 = await hre.contracts.get('TellerV2')
  const SmartCommitmentForwarder = await hre.contracts.get(
    'SmartCommitmentForwarder'
  )
  const tellerV2Address = await tellerV2.getAddress()

  const smartCommitmentForwarderAddress =
    await SmartCommitmentForwarder.getAddress()

  let uniswapV3FactoryAddress: string
  switch (hre.network.name) {
    case 'mainnet':
    case 'goerli':
    case 'arbitrum':
    case 'optimism':
    case 'polygon':
    case 'localhost':
      uniswapV3FactoryAddress = '0x1F98431c8aD98523631AE4a59f267346ea31F984'
      break
    case 'base':
      uniswapV3FactoryAddress = '0x33128a8fC17869897dcE68Ed026d694621f6FDfD'
      break
    case 'sepolia':
      uniswapV3FactoryAddress = '0x0227628f3F023bb0B980b67D528571c95c6DaC1c'
      break
    default:
      throw new Error('No swap factory address found for this network')
  }
  const uniswapPricingLibrary = await hre.deployments.get('UniswapPricingLibrary')

 

//this is why the owner of the beacon should be timelock controller ! 
// so we can upgrade it like this . Using a proposal.  This actually goes AROUND the proxy admin, interestingly. 
  await hre.upgrades.proposeBatchTimelock({
    title: 'LenderGroups: PoolOracle View',
    description: ` 
# LenderGroups

* A patch to add readonly fns for the frontend.
`,
    _steps: [
      {
        beacon: lenderCommitmentGroupBeaconProxy,
        implFactory: await hre.ethers.getContractFactory('LenderCommitmentGroup_Smart', {
          libraries: {
            UniswapPricingLibrary: uniswapPricingLibrary.address,
          },
        }),

        opts: {
          unsafeSkipStorageCheck: true, 
          unsafeAllow: [
            'constructor',
            'state-variable-immutable',
            'external-library-linking',
          ],
          constructorArgs: [
            tellerV2Address,
            smartCommitmentForwarderAddress,
            uniswapV3FactoryAddress,

          ],
        },
      },
    ],
  })

  hre.log('done.')
  hre.log('')
  hre.log('----------')

  return true
}

// tags and deployment
deployFn.id = 'lender-commitment-group-beacon:upgrade-pooloracle-view'
deployFn.tags = ['lender-commitment-group-beacon']
deployFn.dependencies = [
  'teller-v2:deploy',
  'smart-commitment-forwarder:deploy',
  'teller-v2:uniswap-pricing-library',
  'lender-commitment-group-beacon:deploy'
]

deployFn.skip = async (hre) => {
  return !hre.network.live || !['sepolia','polygon'].includes(hre.network.name)
}
export default deployFn
