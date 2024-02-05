"use client"

import { useParams } from "next/navigation";
import { useContractRead, useContractWrite, usePrepareContractWrite } from "wagmi";
import pool from '@/public/pool.json'
import { useEffect, useState } from "react";
import lmTokenAbi from "@/public/lmToken.json"

const PoolPage = () => {

    const poolData = useParams()?.poolAddress as string
    const poolAddress = poolData.split("-")[0]
    const poolName = poolData.split("-")[1]
    const [apy, setApy] = useState("");
    const [userBalanceInPool, setUserBalanceInPool] = useState("-");
    const [poolTVL, setPoolTVL] = useState("");
    const [lmAmount,setLmAmount] = useState(0)
    useContractRead({
        address: poolAddress,
        abi: pool,
        onSuccess: (data: any) => {
            setApy(String(data).replace("n", ""))
        },
        functionName: 'apy',
        args: [],
        enabled: true,
    });
    const { config: configGetMyBalance } = usePrepareContractWrite({
        address: poolAddress,
        abi: pool,
        onSuccess: (data) => {
            userBalanceInPool === "-" && setUserBalanceInPool(String(data.result).replace("n", ""))
        },
        functionName: 'getMyBalance',
        args: [],
        enabled:true
    });
    const { isSuccess: isSuccessGetMyBalance, write: writeGetMyBalance } = useContractWrite(configGetMyBalance);

    useContractRead({
        address: poolAddress,
        abi: pool,
        onSuccess: (data: any) => {
            setPoolTVL(String(data).replace("n", ""))
        },
        functionName: 'getPoolTVL',
        args: [],
        enabled: true,
    });
    const { config: configDeposit } = usePrepareContractWrite({
        address: poolAddress,
        abi: pool,
        onSuccess: (data) => {
        },
        functionName: 'deposit',
        args: [lmAmount * 10 ** 18],
    });
    const { isSuccess: isSuccesDeposit, write: writeDeposit } = useContractWrite(configDeposit);

    const { config: configOfLMToken } = usePrepareContractWrite({
        address: `0x${process.env.NEXT_PUBLIC_LM_TOKEN_ADDRESS}`,
        abi: lmTokenAbi,
        functionName: 'approve',
        args: [`0x${process.env.NEXT_PUBLIC_DAO_ADDRESS}`, lmAmount * 10 ** 18],
    });
    const { isSuccess: isSuccessOfLMToken, write: writeOfLMToken } = useContractWrite(configOfLMToken);

    useEffect(()=>{
        writeDeposit && writeDeposit()
    },[isSuccessOfLMToken])
   

    const { config: configWithdraw } = usePrepareContractWrite({
        address: poolAddress,
        abi: pool,
        onSuccess: (data) => {
        },
        functionName: 'withdraw',
        args: [lmAmount * 10 ** 18],
    });
    const { isSuccess: isSuccessWithdraw, write: writeWithdraw } = useContractWrite(configWithdraw);

    const deposit = () => {
        writeOfLMToken && writeOfLMToken()
    }

    const withdraw = () => {
        writeWithdraw && writeWithdraw()
    }

    return (
        <div className="w-full p-4 text-center bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
            <h5 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Pool: {poolName}</h5>
            <p className="mb-5 text-base text-white sm:text-lg ">Pool TVL: {poolTVL}{poolName} - Pool APY: %{Number(apy)/100} - User Balance in Pool: {userBalanceInPool}{poolName}</p>
            <div className="items-center justify-center w-60 mb-10 mx-auto space-y-4 sm:flex sm:space-y-0 sm:space-x-4 rtl:space-x-reverse">
                <input value={lmAmount} onChange={(event)=>Number(event.target.value) ? setLmAmount(Number(event.target.value)): 0} type="text" id="amount" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Amount of LM" required />
            </div>
            <div className="items-center justify-center space-y-4 sm:flex sm:space-y-0 sm:space-x-4 rtl:space-x-reverse">
                <button onClick={deposit} type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Deposit</button>
                {Number(userBalanceInPool) !== 0 &&
                    <button onClick={withdraw} type="button" className="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Withdraw</button>
                }
            </div>
        </div>
    )
}


export default PoolPage;