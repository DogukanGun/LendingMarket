// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "./PoolFactory.sol";
import "./PoolData.sol";
import "./interface/IPoolFactory.sol";
import "./interface/IPoolData.sol";

contract Governance {

    struct PoolOffer {
        string poolName;
        address tokenAddress;
        uint256 timestamp;
        address offerOwner;
    }
    
    struct PreviosOffers {
        bool accepted;
        address offerOwner;
        PoolOffer previosPoolOffer;
    }

    struct Vote {
        address voter;
        bool isApproved;
    }

    address governanceTokenAddress;
    address public poolFactoryAddress;
    address public poolDataAddress;
    bool isVotingOn;
    PoolOffer public poolOffer;
    Vote[] votes;
    PreviosOffers[] previosOffers;
    mapping (address=>bool) public voters;
    uint totalVoter;

    event NewPoolOffered(string poolName, address tokenAddress, address offerOwner);
    event OfferFinished(string poolName, bool isApproved);
    event NewPoolCreated(string poolName,address poolAddress);

    constructor(address _governanceTokenAddress) {
        governanceTokenAddress = _governanceTokenAddress;
        poolFactoryAddress = address(new PoolFactory());
        poolDataAddress = address(new PoolData());
        isVotingOn = false;
    }

    modifier onlyTokenHolder {
        require(voters[msg.sender],"You dont have enough token to vote");
        _;
    }

    modifier votingIsOff {
        require(!isVotingOn, "There is a pool in voting");
        _;
    }

    //TODO add user voted or not 

    modifier votingIsOn {
        require(isVotingOn, "There is not a pool in voting");
        _;
    }

    modifier notVoted {
        bool isVoted = false;
        for (uint i = 0; i<votes.length; i++) 
        {
            if(votes[i].voter == msg.sender) {
                isVoted = true;
            }
        }
        require(!isVoted,"You have casted a vote");
        _;
    }

    function joinDao() external {
        bool status = IERC20(governanceTokenAddress).transferFrom(msg.sender,address(this),32);
        require(status, "Transfer failed");
        voters[msg.sender] = true;
        totalVoter += 1;
    }

    function isDaoOwner() external view returns(bool) {
        return voters[msg.sender];
    }

    function leftDao() external onlyTokenHolder{
        bool status = IERC20(governanceTokenAddress).transfer(msg.sender,32);
        require(status, "Transfer failed");
        voters[msg.sender] = false;
        totalVoter -= 1;
    }

    function offerAPool(string memory poolName, address tokenAddress) external votingIsOff onlyTokenHolder{
        isVotingOn = true;
        poolOffer = PoolOffer(poolName,tokenAddress,block.timestamp, msg.sender);
        emit NewPoolOffered(poolName, tokenAddress, msg.sender);
    }

    function countActiveVotes() internal view returns(uint256,uint256) {
        uint positiveCount = 0;
        uint negativeCount = 0;
        for (uint i=0; i<votes.length; i++) 
        {
            if(votes[i].isApproved) {
                positiveCount += 1;
            }else{
                negativeCount += 1;
            }
        }
        return (positiveCount,negativeCount);
    }

    function finishVote() internal {
        (uint positiveCount, uint negativeCount) = countActiveVotes();
        previosOffers.push(PreviosOffers(positiveCount>negativeCount,poolOffer.offerOwner,poolOffer));
        emit OfferFinished(poolOffer.poolName, positiveCount>negativeCount);
        if(positiveCount>negativeCount){
            address poolAddress = IPoolFactory(poolFactoryAddress).createPool(poolOffer.tokenAddress,poolOffer.poolName);
            IPoolData(poolDataAddress).addPoolData(poolOffer.poolName,poolAddress);
            emit NewPoolCreated(poolOffer.poolName, poolAddress);
        }
        isVotingOn = false;
        while(votes.length == 0){
            votes.pop();
        }
        poolOffer.offerOwner=address(0);
        poolOffer.poolName="";
        poolOffer.tokenAddress=address(0);
    }

    function finishCurrentOffer() external onlyTokenHolder votingIsOn {
        if(block.timestamp >= poolOffer.timestamp + 604800){
            finishVote();
        }
    }

    function vote(bool isApprove) external votingIsOn onlyTokenHolder notVoted{
        votes.push(Vote(msg.sender,isApprove));
        if(votes.length == totalVoter){
            finishVote();
        }
    }
}