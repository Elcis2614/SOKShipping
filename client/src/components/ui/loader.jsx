import loader from '../../assets/loader.svg';

export const Loader = function({editText="LOADIND..."}){
    return(
    <div className='fixed w-full h-full z-20 left-0 top-0 flex items-center  justify-center backdrop-blur-[1px]'>
        <div className='relative items-center justify-center '>
            <img src={loader} className='size-xl'/>
            <div className='text-[#e15b64] animate-pulse text-center font-medium'>{editText}</div>
        </div>
    </div>)
}