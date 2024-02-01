"use client"

import { useContractRead, useContractWrite, usePrepareContractWrite } from "wagmi";
import daoAbi from '@/public/dao.json'
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const MakeAnOffer = () => {

    const router = useRouter();

    const [poolName,setPoolName] = useState("");
    const [tokenAddress,setTokenAddress] = useState("");

    useContractRead({
        address: `0x${process.env.NEXT_PUBLIC_DAO_ADDRESS}`,
        abi: daoAbi,
        functionName: 'poolOffer',
        args: [],
        enabled: true,
        onSuccess(data: any[]) {
            if (data[0] !== "") {
                router.replace("/dao")
            }
        },
    });

    const { config } = usePrepareContractWrite({
        address: `0x${process.env.NEXT_PUBLIC_DAO_ADDRESS}`,
        abi: daoAbi,
        functionName: 'offerAPool',
        args: [poolName,tokenAddress],
    });
    const { write, error, isLoading, isSuccess, isError } = useContractWrite(config);
    
    const offerAPool = () => {
        write && write()
    }

    useEffect(()=>{
        if(!isError && isSuccess && !isLoading && error == null){
            router.replace("/dao")
        }

    },[isError,isLoading,isSuccess,error])

    return (
        <div className="bg-white py-6 sm:py-8 lg:py-12">
            <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
                <div className="mb-10 md:mb-16">
                    <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-6 lg:text-3xl">Let's make an offer</h2>
                </div>

                <div className="mx-auto grid max-w-screen-md gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                        <label htmlFor="poolName" className="mb-2 inline-block text-sm text-gray-800 sm:text-base">Pool Name</label>
                        <input value={poolName} onChange={(event)=>setPoolName(event.target.value)} name="poolName" className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
                    </div>

                    <div className="sm:col-span-2">
                        <label htmlFor="tokenAddress" className="mb-2 inline-block text-sm text-gray-800 sm:text-base">Token Address</label>
                        <input name="tokenAddress" value={tokenAddress} onChange={(event)=>setTokenAddress(event.target.value)} className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
                    </div>

                    <div className="flex items-center justify-between sm:col-span-2">
                        <button onClick={offerAPool} className="inline-block w-full rounded-lg bg-indigo-500 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-indigo-300 transition duration-100 hover:bg-indigo-600 focus-visible:ring active:bg-indigo-700 md:text-base">Send</button>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default MakeAnOffer;