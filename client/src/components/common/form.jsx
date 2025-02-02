// client/src/components/common/form.jsx 

import React from 'react'
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label'
import { 
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,} from '../ui/select';
import { Textarea } from '../ui/textarea';

function CommonForm({ formControls, formData, setFormData, onSubmit, buttonText, isBtnDisabled }) {

    function renderInputsByComponentType(getControlItem) {
        let element = null;
        const value = formData[getControlItem.name] || '';


        switch (getControlItem.componentType) {
            case 'input':
                element = (
                    <Input
                        name={getControlItem.name}
                        placeholder={getControlItem.placeholder}
                        id={getControlItem.name}
                        type={getControlItem.type}
                        value={value}
                        onChange={(event) =>
                            setFormData({
                                ...formData,
                                [getControlItem.name]: event.target.value,
                            })
                        }
                        className="w-full border text-left border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
                    
                    />
                );

                break;

            case 'select':
                element = (
                    <Select onValueChange={(value) => setFormData({
                        ...formData,
                        [getControlItem.name]: value
                    })} 
                    value={value}
                    >

                        <SelectTrigger className="w-full text-left">
                            <SelectValue placeholder={getControlItem.label} />
                        </SelectTrigger>
                        
                        <SelectContent>
                            {
                                getControlItem.options && getControlItem?.options.length > 0 ?
                                    getControlItem.options.map((optionItem) => (
                                        <SelectItem key={optionItem.id} value={optionItem.id}
                                        >
                                            {optionItem.label}
                                        </SelectItem>))
                                    : null
                            }
                        </SelectContent>
                    </Select>

                );

                break;

            case 'textarea':
                element = (
                    <Textarea
                        name={getControlItem.name}
                        placeholder={getControlItem.placeholder}
                        id={getControlItem.id}
                        value={value}
                        onChange={(event) =>
                            setFormData({
                                ...formData,
                                [getControlItem.name]: event.target.value,
                            })
                        }

                    className="w-full border border-gray-300 text-left rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"

                    />
                );

                break;

            default:
                element = (
                    <Input
                        name={getControlItem.name}
                        placeholder={getControlItem.placeholder}
                        id={getControlItem.name}
                        type={getControlItem.type}
                        value={value}
                        onChange={(event) =>
                            setFormData({
                                ...formData,
                                [getControlItem.name]: event.target.value,
                            })
                        }
                        
                    className="w-full text-left border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
                    
                    />
                );
                break;

        }
        return element;
    }

    return (
        <form onSubmit={onSubmit}>
            <div className="flex flex-col gap-4">
                {
                    formControls.map((controlItem )=> (
                        <div key={controlItem.name} className=" grid pag-1.5" >
                            <Label htmlFor={controlItem.name} className="mb-1 text-sm font-medium text-gray-700" >
                                {controlItem.label}
                            </Label>
                            {
                                renderInputsByComponentType(controlItem)
                            }
                        </div>)
                    )}
            </div>
            <Button 
                disabled={isBtnDisabled}
                type='submit' 
                className={`mt-4 w-full py-2 rounded-lg text-white transition duration-300 ${
                    isBtnDisabled
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
                
                >
                {buttonText || 'Submit'}
            </Button>

        </form>
    )
}

export default CommonForm