// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v4.7.0) (security/Pausable.sol)

pragma solidity ^0.8.0;

 
 
//import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
 

import "../interfaces/IHasProtocolPausingManager.sol";

import "../interfaces/IProtocolPausingManager.sol";
 

abstract contract HasFirewallManager 
    is  
    IHasFirewallManager    
    {
  

       
    address private _firewallManager; // 20 bytes, gap will start at new slot 
  

    modifier firewallAllowsSender() {
        require( 
            _firewallManager == address(0x0) || 
            IFirewallManager(_firewallManager).msgSenderIsAllowed(msg.sender), "FW: Blocked" );
      
        _;
    }

     

        
    function _setFirewallManager(address firewallManager) internal {
        _protocolPausingManager = protocolPausingManager ;
    }


    function getFirewallManager() public view returns (address){

        return _firewallManager;
    }

     

 

    /**
     * @dev This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[49] private __gap;
}
