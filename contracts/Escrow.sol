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

    mapping(uint256 => bool) public isListing;
    mapping(uint256 => uint256) public purchasePrice;
    mapping(uint256 => uint256) public escrowAmount;
    mapping(uint256 => address) public buyer;

    constructor ( address _ntfAddress, address payable _seller, address _inspector,address _lender ){
        lender = _lender;
        seller = _seller;
        nftAddress = _ntfAddress;
        inspector = _inspector;
    }

    function List (uint256 _nftID, uint256 _purchasePrice, uint256 _escrowAmount, address _buyer) public {
    // transfer NFT from seller to this contract
        IERC721(nftAddress).transferFrom(msg.sender, address(this), _nftID);
        isListing[_nftID] = true;
        purchasePrice[_nftID] = _purchasePrice;
        escrowAmount[_nftID] = _escrowAmount;
        buyer[_nftID] = _buyer;
    }
}
