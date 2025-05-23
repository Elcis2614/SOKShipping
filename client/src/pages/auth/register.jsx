// client/src/pages/auth/register.jsx 

import CommonForm from '@/components/common/form'
import { registerFormControls } from '@/config'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from "react";
import { registerUser } from '@/store/auth-slice';
import { useDispatch } from 'react-redux';
import { toast, useToast } from '@/hooks/use-toast';


const initialState = {
    userName: '',
    email: '',
    password: ''
}

function AuthRegister() {
    const [formData, setFormData] = useState(initialState);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {toast} = useToast();
    const [isFilled, setIsFilled] = useState(false);
    

    function onSubmit(event) {
        event.preventDefault();
        dispatch(registerUser(formData)).then((data) => {
            if (data?.payload?.success) {
                toast({
                    title : data?.payload?.message,
                });
                navigate('/auth/login');
            } else {
                toast({
                    title: data?.payload?.message, 
                    variant: "destructive",
                })
            }
        });
    }

    console.log(formData);
    
    return (
        <div className="mx-auto w-full max-w-wmd space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    Create a new Account
                </h1>
                <p>Already have an account ?
                    <Link className="font-bold ml-2 text-primary underline text-yellow-500" to="/auth/login">
                        Login
                    </Link>
                </p>
            </div>
            <CommonForm
                formControls={registerFormControls}
                buttonText={'Sign up'}
                formData={formData}
                setFormData={setFormData}
                onSubmit={onSubmit}
                isBtnDisabled={!isFilled}
            />
        </div>
    )
}

export default AuthRegister;
