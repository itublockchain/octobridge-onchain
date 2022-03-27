const { ethers } = require("hardhat");
const tokenI = require("../artifacts/@openzeppelin/contracts/token/ERC20/IERC20.sol/IERC20.json");
const provider = ethers.provider;


async function main() {
    const [deployer] = await ethers.getSigners();

    let baseNonce = provider.getTransactionCount(deployer.address);
    let nonceOffset = 0;

    function getNonce() {
        return baseNonce.then((nonce) => (nonce + (nonceOffset++)));
    }

    console.log("Deploying contracts with the account:", deployer.address);

    console.log("Account balance:", (await deployer.getBalance()).toString());

    const Bridge = await ethers.getContractFactory("OctoBridge");
    const bridge = await Bridge.deploy(0, [1, 2, 3], deployer.address, { nonce: getNonce() });

    console.log("Contract address:", bridge.address);

    let token = new ethers.Contract('0xa9d19d5e8712C1899C4344059FD2D873a3e2697E', tokenI.abi, provider);
    tx_0 = await token.connect(deployer).approve(bridge.address, ethers.utils.parseEther('100'), { nonce: getNonce() });
    tx_0.wait();

    tx_1 = await bridge.connect(deployer).lock(0, 1, '0xa9d19d5e8712C1899C4344059FD2D873a3e2697E', ethers.utils.parseEther('5'), { nonce: getNonce() });
    tx_1.wait();
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
