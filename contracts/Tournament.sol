// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

//import "hardhat/console.sol";

contract TournamentMatch {
  address[2] public competitors;
  address public winner;

  constructor(address[2] memory _competitors) {
    competitors = _competitors;
  }

  function declareWinner(address _address) public {
    require(isCompetitor(_address), "Address does not belong to match competitor");
    winner = _address;
  }

  function isCompetitor(address _address) public view returns (bool) {
    for (uint256 i = 0; i < competitors.length; i++) {
      if (competitors[i] == _address) {
        return true;
      }
    }
    return false;
  }
}

contract Tournament {
  string public name;
  uint256 public registrationCloseTime;
  uint256 public startTime;
  address[] public competitors;
  TournamentMatch[][] public roundMatches;

  constructor(
    string memory _name,
    uint256 _registrationCloseTime,
    uint256 _startTime
  ) {
    name = _name;
    require(
      _startTime > _registrationCloseTime,
      "Tournament start time must be after registration close time"
    );
    registrationCloseTime = _registrationCloseTime;
    startTime = _startTime;
  }

  function registerCompetitor(address _address) public {
    // need to ensure address is not already registered
    competitors.push(_address);
  }

  function competitorCount() public view returns (uint256) {
    return competitors.length;
  }

  function currentRound() public view returns (uint256) {
    return roundMatches.length;
  }

  function currentRoundMatchesCount() public view returns (uint256) {
    return roundMatches[currentRound() - 1].length;
  }

  function generateRoundMatches() public {
    require(
      block.timestamp > registrationCloseTime,
      "Can't deploy tournament matches before registration close time"
    );
    TournamentMatch[] memory currentRoundMatches = new TournamentMatch[](competitors.length / 2);
    uint8 matchIndex = 0;
    uint256 currentRoundMatchesIndex = 0;
    if (this.currentRound() == 0) {
      // Deploy epoch matches
      while (matchIndex < competitors.length) {
        TournamentMatch matchContractAddress = new TournamentMatch(
          [competitors[matchIndex], competitors[matchIndex + 1]]
        );
        currentRoundMatches[currentRoundMatchesIndex] = matchContractAddress;
        currentRoundMatchesIndex++;
        matchIndex = matchIndex + 2;
      }
    } else {
      /*
        Iterate over last round matches and pair winners in new match
        not sure if assigning roundMatches[this.currentRound() - 1] would increase gas cost
        */
      // TODO this errors atm need to figure out how this works when there aren't enough matches to pair
      TournamentMatch[] memory lastRoundMatches = roundMatches[this.currentRound() - 1];
      console.log("lastRoundMatches %s", lastRoundMatches.length);
      while (matchIndex < lastRoundMatches.length) {
        address winner1 = lastRoundMatches[matchIndex].winner.address;
        address winner2 = lastRoundMatches[matchIndex + 1].winner.address;
        TournamentMatch matchContractAddress = new TournamentMatch([winner1, winner2]);
        currentRoundMatches[currentRoundMatchesIndex] = matchContractAddress;
        currentRoundMatchesIndex++;
        matchIndex = matchIndex + 2;
      }
    }

    roundMatches.push(currentRoundMatches);
  }

  /*
    In th event that a winner can not be determined or decided
    return all assets back to original accounts
    */
  function unlockAssetsFallback() public {}
}
