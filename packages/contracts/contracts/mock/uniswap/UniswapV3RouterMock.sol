// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MockSwapRouter {
    event SwapExecuted(address tokenIn, address tokenOut, uint256 amountIn, uint256 amountOut);

    function exactInputSingle(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 amountOutMinimum,
        address recipient
    ) external {
        require(IERC20(tokenIn).balanceOf(msg.sender) >= amountIn, "Insufficient balance for swap");
        require(IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn), "Transfer failed");

        // Mock behavior: transfer the output token to the recipient
        uint256 amountOut = amountIn; // Mocking 1:1 swap for simplicity
        require(amountOut >= amountOutMinimum, "Output amount too low");

        IERC20(tokenOut).transfer(recipient, amountOut);
        emit SwapExecuted(tokenIn, tokenOut, amountIn, amountOut);
    }
}