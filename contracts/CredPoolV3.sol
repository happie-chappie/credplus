//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "hardhat/console.sol";
import "./dependencies/IERC20.sol";
import "./ICToken.sol";

contract CredPoolV3 {
	// fixed interest rate
	uint INITIAL_DAI = 300000;
	uint interestRate = 10;
	uint daiReserve;

	// dai address
	address public DAI_ADDRESS = 0x6B175474E89094C44Da98b954EedeAC495271d0F;
	ICToken public CToken;
	IERC20 public dai = IERC20(DAI_ADDRESS);

    // An address type variable is used to store ethereum accounts.
    address public owner;

	constructor() {
        owner = msg.sender;
		dai.transferFrom(msg.sender, address(this), INITIAL_DAI);
	}

	function deposit(uint amount) external {
		dai.approve(address(this), amount);
		dai.transferFrom(msg.sender, address(this), amount);
	}

	function withdraw(uint amount) external {
		dai.transferFrom(address(this), msg.sender, amount);
	}

	function borrow(uint amount, address _ctoken) external {
		dai.transferFrom(address(this), msg.sender, amount);
		console.log("The amount is ", amount);
		ICToken(_ctoken).mint(address(this), amount);
	}

	function repay(uint amount) external {
		dai.approve(address(this), amount);
		dai.transferFrom(msg.sender, address(this), amount);
	}
}
