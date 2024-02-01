import { usePrepareContractWrite, useContractWrite } from "wagmi";
import lmTokenAbi from "@/public/lmToken.json"
import daoAbi from "@/public/dao.json"
import { useEffect } from "react";

interface DaoHeaderProps {
    isDaoOwner:boolean;
    onStakeSuccess:()=>void
}

const DaoHeader = ({isDaoOwner,onStakeSuccess}:DaoHeaderProps) => {

    const { config:configOfDao } = usePrepareContractWrite({
        address: `0x${process.env.NEXT_PUBLIC_DAO_ADDRESS}`,
        abi: daoAbi,
        functionName: 'joinDao',
        args: [],
    });
    const { isSuccess:isSuccessOfDao, write:writeOfDao } = useContractWrite(configOfDao);

    const { config:configOfDaoLeft } = usePrepareContractWrite({
        address: `0x${process.env.NEXT_PUBLIC_DAO_ADDRESS}`,
        abi: daoAbi,
        functionName: 'leftDao',
        args: [],
    });
    const {  write:writeOfDaoLeft } = useContractWrite(configOfDaoLeft);

    const { config:configOfLMToken } = usePrepareContractWrite({
        address: `0x${process.env.NEXT_PUBLIC_LM_TOKEN_ADDRESS}`,
        abi: lmTokenAbi,
        functionName: 'approve',
        args: [`0x${process.env.NEXT_PUBLIC_DAO_ADDRESS}`,32*10**18],
    });
    const { isSuccess:isSuccessOfLMToken, write:writeOfLMToken } = useContractWrite(configOfLMToken);

    useEffect(()=>{
      isSuccessOfLMToken &&writeOfDao && writeOfDao()
      isSuccessOfDao && onStakeSuccess()
    },[isSuccessOfLMToken,isSuccessOfDao])

    const onButtonClickForJoinDao = () => {
        writeOfLMToken && writeOfLMToken()
    }

    const onButtonClickForLeftDao = () => {
        writeOfDaoLeft && writeOfDaoLeft()
    }


    return (
        <div className="bg-white py-6 sm:py-8 lg:py-12">
        <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
          <div className="flex flex-col items-center rounded-lg bg-gray-100 p-4 sm:p-8 lg:flex-row lg:justify-between">
            <div className="mb-4 sm:mb-8 lg:mb-0">
              <h2 className="text-center text-xl font-bold text-indigo-500 sm:text-2xl lg:text-left lg:text-3xl">{isDaoOwner ? "Welcome Back Your Lending Protocol" : "Do you want to become a member of dao ?"}</h2>
            </div>
            <div className="flex flex-col items-center lg:items-end">
              <div className="mb-3 flex w-full max-w-md gap-2">
                { !isDaoOwner && <button onClick={onButtonClickForJoinDao} className="inline-block rounded bg-indigo-500 px-8 py-2 text-center text-sm font-semibold text-white outline-none ring-indigo-300 transition duration-100 hover:bg-indigo-600 focus-visible:ring active:bg-indigo-700 md:text-base">Stake 32 LT</button>}
                { isDaoOwner && <button onClick={onButtonClickForLeftDao} className="inline-block rounded bg-indigo-500 px-8 py-2 text-center text-sm font-semibold text-white outline-none ring-indigo-300 transition duration-100 hover:bg-indigo-600 focus-visible:ring active:bg-indigo-700 md:text-base">Left From Dao</button>}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
}

export default DaoHeader;