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

    constructor (address _lender, address payable _seller, address _ntfAddress, address _inspector ){
        lender = _lender;
        seller = _seller;
        nftAddress = _ntfAddress;
        inspector = _inspector;
    }

}
