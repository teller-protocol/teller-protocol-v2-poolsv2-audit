

import "forge-std/console.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../../libraries/uniswap/core/interfaces/callback/IUniswapV3FlashCallback.sol";

contract UniswapV3PoolMock {
    //this represents an equal price ratio
    uint160 mockSqrtPriceX96 = 2 ** 96;

    address mockToken0;
    address mockToken1;
    uint24 fee;

    

    struct Slot0 {
        // the current price
        uint160 sqrtPriceX96;
        // the current tick
        int24 tick;
        // the most-recently updated index of the observations array
        uint16 observationIndex;
        // the current maximum number of observations that are being stored
        uint16 observationCardinality;
        // the next maximum number of observations to store, triggered in observations.write
        uint16 observationCardinalityNext;
        // the current protocol fee as a percentage of the swap fee taken on withdrawal
        // represented as an integer denominator (1/x)%
        uint8 feeProtocol;
        // whether the pool is locked
        bool unlocked;
    }

    function set_mockSqrtPriceX96(uint160 _price) public {
        mockSqrtPriceX96 = _price;
    }

    function set_mockToken0(address t0) public {
        mockToken0 = t0;
    }


    function set_mockToken1(address t1) public {
        mockToken1 = t1;
    }

    function set_mockFee(uint24 f0) public {
        fee = f0;
    }

    function token0() public returns (address) {
        return mockToken0;
    }

    function token1() public returns (address) {
        return mockToken1;
    }


    function slot0() public returns (Slot0 memory slot0) {
        return
            Slot0({
                sqrtPriceX96: mockSqrtPriceX96,
                tick: 0,
                observationIndex: 0,
                observationCardinality: 0,
                observationCardinalityNext: 0,
                feeProtocol: 0,
                unlocked: true
            });
    }

    //mock fn 
   function observe(uint32[] calldata secondsAgos)
        external
        view
        returns (int56[] memory tickCumulatives, uint160[] memory secondsPerLiquidityCumulativeX128s)
    {
        // Initialize the return arrays
        tickCumulatives = new int56[](secondsAgos.length);
        secondsPerLiquidityCumulativeX128s = new uint160[](secondsAgos.length);

        // Mock data generation - replace this with your logic or static values
        for (uint256 i = 0; i < secondsAgos.length; i++) {
            // Generate mock data. Here we're just using simple static values for demonstration.
            // You should replace these with dynamic values based on your testing needs.
            tickCumulatives[i] = int56(1000 * int256(i)); // Example mock data
            secondsPerLiquidityCumulativeX128s[i] = uint160(2000 * i); // Example mock data
        }

        return (tickCumulatives, secondsPerLiquidityCumulativeX128s);
    }




    /* 

            interface IUniswapV3FlashCallback {
                function uniswapV3FlashCallback(
                    uint256 fee0,
                    uint256 fee1,
                    bytes calldata data
                ) external;
            }
    */
     event Flash(address indexed recipient, uint256 amount0, uint256 amount1, uint256 paid0, uint256 paid1);

    function flash(
        address recipient,
        uint256 amount0,
        uint256 amount1,
        bytes calldata data
    ) external {
        uint256 balance0Before = IERC20(mockToken0).balanceOf(address(this));
        uint256 balance1Before = IERC20(mockToken1).balanceOf(address(this));

          console.log("balance before");

        console.logUint( balance0Before  );
        console.logUint( balance1Before  );

        if (amount0 > 0) {
            IERC20(mockToken0).transfer(recipient, amount0);
        }
        if (amount1 > 0) {
            IERC20(mockToken1).transfer(recipient, amount1);
        }

        // Execute the callback
        IUniswapV3FlashCallback(recipient).uniswapV3FlashCallback(   // what will the fee actually be irl ? 
            amount0 / 100, // Simulated fee for token0 (1%)
            amount1 / 100, // Simulated fee for token1 (1%)
            data
        );

        uint256 balance0After = IERC20(mockToken0).balanceOf(address(this));
        uint256 balance1After = IERC20(mockToken1).balanceOf(address(this));

        console.log("balance after");
        console.logUint( balance0After  );
         console.logUint( balance1After  );

        require(balance0After >= balance0Before + (amount0 / 100), "Insufficient repayment for token0");
        require(balance1After >= balance1Before + (amount1 / 100), "Insufficient repayment for token1");

        emit Flash(recipient, amount0, amount1, balance0After - balance0Before, balance1After - balance1Before);
    }
 
      

}








 