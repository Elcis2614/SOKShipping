import * as React from 'react';
import { Button } from './button';
import { Loader } from 'lucide-react';
import { 
    AlertDialogContent,
    Sheet,
    SheetTitle,
    SheetPortal,
    SheetOverlay,
    SheetTrigger,
    SheetClose } from './sheet'

const AlertDialog = ({ title, handleCLick, isLoading=false}) => {
    return (
        <SheetPortal>
            <SheetOverlay />
            <AlertDialogContent className='fixed bg-white w-max max-w-sm top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md p-6 shadow'>
                <SheetTitle className='pb-2'>
                    <h2 className='text-xl'>{title}</h2>
                </SheetTitle>
                <div>
                    <div className='text-gray-800 mb-5 max-w-[80%]'>
                        This product will be permanently removed.
                        Do you still want to delete ?
                    </div>
                    <div className='flex justify-between gap-3'>
                        <SheetClose disabled={isLoading}>
                            <Button
                                variant="ghost"
                                size="dialog"
                                disabled={isLoading}
                            >Cancel</Button>
                        </SheetClose>
                        <Button disabled={isLoading} variant="destructive" onClick={handleCLick} size="dialog">
                                <div>
                                    {isLoading ?
                                        <Loader className='animate-spin' color="white"/> :
                                        "Delete"
                                    }   
                                </div>
                        </Button>
                    </div>
                </div>
            </AlertDialogContent>
        </SheetPortal>
    )
}
export { AlertDialog };