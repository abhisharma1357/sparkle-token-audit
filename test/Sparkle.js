const Sparkle = artifacts.require('Sparkle.sol');

var Web3 = require("web3");
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

//account 0 
//account 1 
//account 2 
//account 3 
//account 4 
//account 5   
//account 6 
//account 7 
//account 8 
//account 9 

contract('Sparkle Contract', async (accounts) => {

  it('Should correctly initialize constructor values of Sparkle Token Contract', async () => {
    
    this.tokenhold = await Sparkle.new({from : accounts[0], gas: 60000000 });
    let totalSupply = await this.tokenhold.totalSupply();
    let name = await this.tokenhold.name();
    let symbol = await this.tokenhold.symbol();
    let owner = await this.tokenhold.owner();
    let decimal = await this.tokenhold.decimals();
    assert.equal(totalSupply.toNumber()/10**8,70000000);
    assert.equal(name,'Sparkle');
    assert.equal(symbol,'SPRKL');
    assert.equal(decimal.toNumber(),8);
    assert.equal(owner, accounts[0]);
  
  });

  it('Should check the Total Supply of Sparkle Tokens', async () => {

    let totalSupply = await this.tokenhold.totalSupply();
    assert.equal(totalSupply.toNumber()/10**8,70000000); 

  });

  it('Should check the Name of a token of sparkle contract', async () => {

    let name = await this.tokenhold.name();
    assert.equal(name,'Sparkle'); 

  });

  it('Should check the symbol of a token of sparkle contract', async () => {

    let symbol = await this.tokenhold.symbol();
    assert.equal(symbol,'SPRKL'); 

  });

  it('Should check the decimal of a token of sparkle contract', async () => {

    let decimal = await this.tokenhold.decimals();
    assert.equal(decimal.toNumber(),8); 

  });

  it('Should check the Owner of a sparkle token contract', async () => {

    let owner = await this.tokenhold.owner();
    assert.equal(owner, accounts[0]); 

  });

  it('Should check caller is Owner ', async () => {

    let isOwner = await this.tokenhold.isOwner({from : accounts[0]});
    assert.equal(isOwner,true); 

  });

  it('Should check if caller is owner or not when called from Non Owner Account', async () => {

    let isOwner = await this.tokenhold.isOwner({from : accounts[1]});
    assert.equal(isOwner,false); 

  });

  it('Should check the balance of a Owner', async () => {

    let balanceOfOwner = await this.tokenhold.balanceOf(accounts[0]);
    assert.equal(balanceOfOwner.toNumber()/10**8,70000000); 

  });

  it('Should check the balance of a Owner', async () => {

    let balanceOfOwner = await this.tokenhold.balanceOf(accounts[0]);
    assert.equal(balanceOfOwner.toNumber()/10**8,70000000); 
  });

  it('Should be able to transfer tokens to accounts[1]', async () => {

    let balanceOfOwner = await this.tokenhold.balanceOf(accounts[0]);
    assert.equal(balanceOfOwner.toNumber()/10**8,70000000);
    let balanceOfBeneficiary = await this.tokenhold.balanceOf(accounts[1]);
    assert.equal(balanceOfBeneficiary.toNumber(),0); 
    await this.tokenhold.transfer(accounts[1],10000000*10**8, { from: accounts[0], gas: 5000000 });
    let balanceOfOwnerLater = await this.tokenhold.balanceOf(accounts[0]);
    assert.equal(balanceOfOwnerLater.toNumber()/10**8,60000000);
    let balanceOfBeneficiaryLater = await this.tokenhold.balanceOf(accounts[1]);
    assert.equal(balanceOfBeneficiaryLater.toNumber()/10**8,10000000);
  });

  it('Should Not be able to transfer tokens from accounts[1] to another account, more than balance of account[1]', async () => {

  try{
    let balanceOfSender = await this.tokenhold.balanceOf(accounts[1]);
    assert.equal(balanceOfSender.toNumber()/10**8,10000000);
    let balanceOfBeneficiary = await this.tokenhold.balanceOf(accounts[2]);
    assert.equal(balanceOfBeneficiary.toNumber(),0);
    await this.tokenhold.transfer(accounts[2],20000000*10**8,{from: accounts[1], gas: 5000000 });
  }catch(error){
    var error_ = 'VM Exception while processing transaction: revert';
    assert.equal(error.message, error_, 'Reverted ');
  }
});

it("should Approve address[3] to spend specific token on the behalf of owner", async () => {

  this.tokenhold.approve(accounts[3], 60000000*10**8, { from: accounts[0] });
  let allowance = await this.tokenhold.allowance.call(accounts[0], accounts[3]);
  assert.equal(allowance/10**8,60000000, "allowance is wrong when approve");

});

it("should increase allowance of address[3] to spend specific token on the behalf of owner", async () => {

  let allowance = await this.tokenhold.allowance.call(accounts[0], accounts[3]);
  assert.equal(allowance/10**8,60000000, "allowance is wrong when approve");
  this.tokenhold.increaseAllowance(accounts[3],60000000*10**8,{from: accounts[0] });
  let allowanceLater = await this.tokenhold.allowance.call(accounts[0], accounts[3]);
  assert.equal(allowanceLater/10**8,120000000, "allowance is wrong when approve");

});

it('Should Not be able to transfer tokens approved by Owner to accounts[3] more than owner have', async () => {

  try{
    let allowance = await this.tokenhold.allowance.call(accounts[0], accounts[3]);
    assert.equal(allowance/10**8,120000000, "allowance is wrong when approve");
    let balanceOfOwnerLater = await this.tokenhold.balanceOf(accounts[0]);
    assert.equal(balanceOfOwnerLater.toNumber()/10**8,60000000);
    let balanceOfBeneficiary = await this.tokenhold.balanceOf(accounts[3]);
    assert.equal(balanceOfBeneficiary.toNumber(),0); 
    await this.tokenhold.transferFrom(accounts[0],accounts[3],120000000*10**8, { from: accounts[3], gas: 5000000 });
  }catch(error){
    var error_ = 'VM Exception while processing transaction: revert';
    assert.equal(error.message, error_, 'Reverted ');
  }

});

it("should decrease allowance of address[3] to spend specific token on the behalf of owner", async () => {

  let allowanceBefore = await this.tokenhold.allowance.call(accounts[0], accounts[3]);
  assert.equal(allowanceBefore/10**8,120000000, "allowance is wrong when approve");
  this.tokenhold.decreaseAllowance(accounts[3],60000000*10**8,{from: accounts[0] });
  let allowanceLater = await this.tokenhold.allowance.call(accounts[0], accounts[3]);
  assert.equal(allowanceLater/10**8,60000000, "allowance is wrong when approve");

});

it('Should be able to transfer tokens approved by Owner to accounts[3] ', async () => {

  let allowance = await this.tokenhold.allowance.call(accounts[0], accounts[3]);
  assert.equal(allowance/10**8,60000000, "allowance is wrong when approve");
  let balanceOfOwner = await this.tokenhold.balanceOf(accounts[0]);
  assert.equal(balanceOfOwner.toNumber()/10**8,60000000);
  let balanceOfBeneficiary = await this.tokenhold.balanceOf(accounts[3]);
  assert.equal(balanceOfBeneficiary.toNumber(),0); 
  await this.tokenhold.transferFrom(accounts[0],accounts[3],60000000*10**8, { from: accounts[3], gas: 5000000 });
  let allowanceLater = await this.tokenhold.allowance.call(accounts[0], accounts[3]);
  assert.equal(allowanceLater,0, "allowance is wrong when approve");
  let balanceOfOwnerLater = await this.tokenhold.balanceOf(accounts[0]);
  assert.equal(balanceOfOwnerLater.toNumber(),0);
  let balanceOfBeneficiaryLater = await this.tokenhold.balanceOf(accounts[3]);
  assert.equal(balanceOfBeneficiaryLater.toNumber()/10**8,60000000);  

});

it("Should Not be able to transfer ownership of Sparkle token Contract from Non Owner Account", async () => {
 
 try{
  let owner = await this.tokenhold.owner();
  assert.equal(owner, accounts[0]); 
  await this.tokenhold.transferOwnership(accounts[9], { from: accounts[1] });
 }catch(error){
  var error_ = 'VM Exception while processing transaction: revert';
  assert.equal(error.message, error_, 'Reverted ');
 }
});

it("Should be able to transfer ownership of Sparkle token Contract ", async () => {
 
  let owner = await this.tokenhold.owner();
  assert.equal(owner, accounts[0]); 
  await this.tokenhold.transferOwnership(accounts[9], { from: accounts[0] });
  let ownerLater = await this.tokenhold.owner();
  assert.equal(ownerLater, accounts[9]);
});

it("Should Not be able to Reannouance ownership of Sparkle token Contract from Non Owner Account", async () => {
 
  try{
    let owner = await this.tokenhold.owner();
    assert.equal(owner,accounts[9]);
    await this.tokenhold.renounceOwnership({ from: accounts[0]});
  }catch(error){
   var error_ = 'VM Exception while processing transaction: revert';
   assert.equal(error.message, error_, 'Reverted ');
  }
 });

it("Should be able to reannouance ownership of Sparkle token Contract ", async () => {
 
  let owner = await this.tokenhold.owner();
  assert.equal(owner,accounts[9]);
  await this.tokenhold.renounceOwnership({ from: accounts[9]});
  let ownerLater = await this.tokenhold.owner();
  assert.equal(ownerLater,0x0000000000000000000000000000000000000000);
});

it("Should be able to burn allowed tokens", async () => {
 
  let balanceOfAccountThree = await this.tokenhold.balanceOf(accounts[3]);
  assert.equal(balanceOfAccountThree.toNumber()/10**8,60000000);  
  this.tokenhold.approve(accounts[4], 60000000*10**8, { from: accounts[3] });
  let allowance = await this.tokenhold.allowance.call(accounts[3], accounts[4]);
  assert.equal(allowance/10**8,60000000, "allowance is wrong when approve");
  await this.tokenhold._burnFrom(accounts[3],60000000*10**8,{from : accounts[4]});
});

})

