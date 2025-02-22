// client/src/pages/auth/login.jsx 

import CommonForm from '@/components/common/form'
import { loginFormControls } from '@/config'
import { Link } from 'react-router-dom'
import { useEffect, useState } from "react";
import { useDispatch } from 'react-redux';
import { useToast } from '@/hooks/use-toast';
import { checkAuth, loginUser} from '@/store/auth-slice';

const initialState = {
    email: '',
    password: ''
}

function AuthLogin() {
    const [formData, setFormData] = useState(initialState);
    const dispatch = useDispatch();
    const {toast} = useToast();
    const [isFilled, setIsFilled] = useState(false);
    

    function onSubmit(event) {
        event.preventDefault();
        
        dispatch(loginUser(formData)).then((data) => {
            if (data?.payload?.success) {
                toast({
                    title : data?.payload?.message,
                });
            } else {
                toast({
                    title: data?.payload?.message, 
                    variant: "destructive",
                })
            }
        });
        
    
    }

    return (
        <div className="mx-auto w-full max-w-wmd space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    Sign in to your account 
                </h1>
                <p>if you don't an account
                    <Link className="font-bold ml-2 text-primary underline text-yellow-500" to="/auth/register">
                       register 
                    </Link>
                </p>
                
            </div>
            <CommonForm
                formControls={loginFormControls}
                buttonText={'Sign In'}
                formData={formData}
                setFormData={setFormData}
                onSubmit={onSubmit}
                isBtnDisabled={!isFilled}
            />
        </div>
    )
}

export default AuthLogin;
