const ethers = require("ethers");
const ABI = require("./ABIs/NewABI");
const fs = require('fs');
const { InfuraKey, NewContract, OldContract } = require("./config");

const provider = new ethers.providers.InfuraProvider("mainnet", InfuraKey);

// Initialize the contract
const contract = new ethers.Contract(NewContract, ABI, provider);
const oldContract = new ethers.Contract(OldContract, ABI, provider);

const owner = async (i) => {
    try {
        const result = await contract.ownerOf(`${i}`);
        return result;
    } catch (e) {
        return ethers.constants.AddressZero;
    }
}

const check = async () => {
    for(let i=9976; i>1; i--) {
        console.log(i);
        const res = await owner(i);
        let data = require("./result.json");
        let result = data.result;
        if(res === ethers.constants.AddressZero) {
            const info = {
                id: i,
                newOwner: res
            };
            result.push(info);
        }
        fs.writeFile("result.json", JSON.stringify(data), 'utf8', function(err) {
            if(err) {
                console.log(err);
            }
        })
    }
}

const update = async () => {
    for(let i=0; i<587; i++) {
        console.log(i);
        let data = require("./result.json");
        let result = data.result;

        let query = result[i];
        let res = await oldContract.ownerOf(query.id);
        
        let updated = require("./updated.json").updated;

        const info = {
            id: query.id,
            owner: res
        }

        updated.push(info);

        fs.writeFile("updated.json", JSON.stringify(updated), 'utf8', function(err) {
            if(err) {
                console.log(err);
            }
        })
    }
}

update();