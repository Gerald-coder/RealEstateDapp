//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

interface IERC721 {
    function transferFrom(
        address _from,
        address _to,
        uint256 _id
    ) external;
}

contract Escrow {
    address public lender;
    address payable public seller ;
    address public nftAddress;
    address public inspector;

    constructor ( address _ntfAddress, address payable _seller, address _inspector,address _lender ){
        lender = _lender;
        seller = _seller;
        nftAddress = _ntfAddress;
        inspector = _inspector;
    }

    function List (uint256 _nftID) public {
        IERC721(nftAddress).transferFrom(msg.sender, address(this), _nftID);
    }
}
