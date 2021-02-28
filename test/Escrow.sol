const { assert } = require("chai");

describe("Escrow", function () {
	let escrow;
	let depositorAddr = "0xF977814e90dA44bFA03b6295A0616a897441aceC";
	let depositorSigner;
	let arbiter;
	let beneficiary;
	let dai;
	let escrowAddress;

	const deposit = ethers.utils.parseEther("0.005");
	before(async () => {
		const signer = await ethers.provider.getSigner(0);
		signer.sendTransaction({ to: depositorAddr, value: ethers.utils.parseEther("1") });
		await hre.network.provider.request({
			method: "hardhat_impersonateAccount",
			params: [depositorAddr]
		})
		depositorSigner = await ethers.provider.getSigner(depositorAddr);

		// const USDTAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
		dai = await ethers.getContractAt("IERC20", "0xdAC17F958D2ee523a2206206994597C13D831ec7", depositorSigner);
		// dai = await ethers.getContractAt("IERC20", "0x6B175474E89094C44Da98b954EedeAC495271d0F", depositorSigner);
		aDai = await ethers.getContractAt("IERC20", "0x028171bCA77440897B824Ca71D1c56caC55b68A3");

		escrowAddress = ethers.utils.getContractAddress({
			from: depositorAddr,
			nonce: (await ethers.provider.getTransactionCount(depositorAddr)) + 1,
		});

		const foo = await dai.approve(escrowAddress, deposit);

		[arbiter, beneficiary] = await ethers.provider.listAccounts();
		const Escrow = await ethers.getContractFactory("Escrow", depositorSigner);
		escrow = await Escrow.deploy(arbiter, beneficiary, deposit);
		await escrow.deployed();
		// await dai.transfer(escrow.address, 200);
		// const usdtBalance = await dai.balanceOf(escrow.address);
		// console.log("=========");
		// console.log(usdtBalance.toString)
	});

	it("should not hold DAI", async function () {
		// const balance = await dai.balanceOf(escrow.address);
		// assert.equal(balance.toString(), "0");
	});

	it("should hold aDAI", async function () {
		// const balance = await aDai.balanceOf(escrow.address);
		// assert.equal(balance.toString(), deposit.toString());
	});

	describe('after approving', () => {
		let balanceBefore;
		before(async () => {
			// pulling the USDT balance of the billionaire
		});
		it("should do", async function () {
			balanceBefore = await dai.balanceOf(depositorAddr);
			console.log("faz "+balanceBefore);

			// await escrow.connect(depositorSigner).approve();
			// balanceBefore = await dai.balanceOf(depositorAddr);
			// console.log("faz "+balanceBefore);
		});

		it("check", async () => {
			// const depositorSigner = await ethers.provider.getSigner(dep);
			await escrow.connect(depositorSigner).approve();
			// dai.transfer(escrow.address, 200);
			const usdtBalance = await dai.balanceOf(escrowAddress);
			console.log("============");
			console.log(usdtBalance.toString());

		});

	});
});

