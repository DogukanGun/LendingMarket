"use client"

import { useContractWrite, usePrepareContractWrite } from "wagmi";
import daoAbi from '@/public/dao.json'
import { useState } from "react";
import DaoHeader from "./components/daoHeader";
import PoolOffer from "./components/poolOffer";

const SellProduct = () => {

    const [isDaoOwner,setIsDaoOwner] = useState(false);

    const { config } = usePrepareContractWrite({
        address: `0x${process.env.NEXT_PUBLIC_DAO_ADDRESS}`,
        abi: daoAbi,
        functionName: 'isDaoOwner',
        args: [],
        enabled:true,
        onSuccess(data) {
            setIsDaoOwner(data.result as boolean)
        },
    });
    const { reset  } = useContractWrite(config);

    return (
        <div className="bg-white py-6 sm:py-8 lg:py-12">
          <DaoHeader onStakeSuccess={()=>reset()} isDaoOwner={isDaoOwner}/>
          <PoolOffer/>
        </div>
    )
}

export default SellProduct;