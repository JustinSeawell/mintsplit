// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library MintSplitSharedLib {
    struct ProjectParams {
        string projectName;
        string symbol;
        uint contentCount;
        uint[] editions;
        uint mintPrice;
        uint releaseTime;
        string baseURI;
        uint package;
    }
    
    struct PaymentSplit {
        address payable[] recipients;
        uint[] bps;
    }

    struct PaymentSplitConfig {
        uint contentId;
        bool isMint;
        PaymentSplit split;
    }

    struct Package {
        uint fee;
        uint limit;
    }
}