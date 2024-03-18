import React, { useState } from 'react';
import { useLang } from '../Context/LangContext';
import { Inertia } from "@inertiajs/inertia";
import Input from '@/Components/Input';
import Label from '@/Components/Label';
import Button from '@/Components/Button';
import ValidationErrors from '@/Components/ValidationErrors';
import { Head, Link, useForm } from '@inertiajs/inertia-react';
import welcomeBackground from '../../../public/images/welcome-background.svg';
import checkIcon from '../../../public/images/check.svg';
import { Select, notification } from 'antd';

export default function Welcome(props) {
    const { lang, changeLocale } = useLang();
    const [selectedLocale, setSelectedLocale] = useState(lang.getLocale());
    const registrationPackages = props.packages.map(pk => { return { value: pk.id, label: pk.name } });

    const { data, setData, post, processing, errors, setError, reset } = useForm({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        password: '',
        password_confirmation: '',
        salonName: '',
        address: '',
        staffNumber: 0,
        seatNumber: 0,
        registrationPackage: '',
    });

    const handleLocaleChange = (value) => {
        localStorage.removeItem("locale");
        localStorage.setItem("locale", value);

        setSelectedLocale(value);
        changeLocale(value);

        Inertia.get(route('locale', { lang: value } ));
    };

    const onHandleChange = (event) => {
        setData(event.target.name, event.target.type === 'checkbox' ? event.target.checked : event.target.value);
    };

    const submit = (e) => {
        e.preventDefault();
        
        post(route('register'), {
            onSuccess: () => {
                openNotification('success',
                    lang.get('strings.Successfully-Registered'),
                    lang.get('strings.Please-wait')
                );
                reset();
            },
        });
    };

    const onSelectedPackageChange = (value) => {
        setData(prevData => { return { ...prevData, registrationPackage: value } });
    };

    const openNotification = (type, message, description) => {
        notification[type]({
            message: message,
            description: description,
        });
    };

    return (
        <>
            <Head title="Welcome" />
            <div className="relative items-top justify-center h-screen bg-gray-100 dark:bg-gray-900 sm:items-center sm:pt-0">
                <div className='welcome-nav flex items-center w-full justify-between h-18 px-16 fixed bg-white' >
                    <div className="logo flex items-center">
                        GoCut
                    </div>
                    <Link href={route('login')}>
                        <div className="welcome-signin-btn flex items-center bg-[#1C274C] px-10 text-white h-10 text-xl tracking-widest font-bold cursor-pointer font-bebas">
                            Sign in
                        </div>
                    </Link>
                </div>
                <div className=" w-screen sm:px-16 lg:px-32 h-screen border-y-2 overflow-hidden" 
                        style={{ backgroundImage: `url(${welcomeBackground})`, backgroundSize: 'cover' }}
                    >
                   <div className='flex justify-between items-center h-full'>
                        <div className="w-1/2">
                            <div className='font-bebas text-3xl'>
                                Power your salon with software you can count on
                            </div>
                            <div className='font-bebas text-2xl font-light mt-6'>
                                See how we can help your business:
                            </div>
                            <div className='flex flex-col gap-y-2 mt-4'>
                                <div className='flex font-bebas text-xl gap-x-2.5'>
                                    <img src={checkIcon} alt="check icon" />
                                    <div>Bring in new clients </div>
                                </div>
                                <div className='flex font-bebas text-xl gap-x-2.5'>
                                    <img src={checkIcon} alt="check icon" />
                                    <div>Make data-driven decisions </div>
                                </div>
                                <div className='flex font-bebas text-xl gap-x-2.5'>
                                    <img src={checkIcon} alt="check icon" />
                                    <div>Synchronize your team 24/7 </div>
                                </div>
                            </div>
                        </div>
                        <div className='bg-[#f4f5f5] h-min sm:w-2/5 lg:w-1/3 border border-slate-400 rounded-xl py-4 px-6'>
                            {/* <ValidationErrors errors={errors} className="mb-1"/> */}

                            <form onSubmit={submit}>
                                <input type='hidden' name='_token' value='{{ csrf_token() }}' />

                                <div className="flex gap-3 justify-between">
                                    <div className="mt-3 w-1/2">
                                        <Label forInput="firstName" value={lang.get('strings.First-Name')} />

                                        <Input
                                            type="text"
                                            name="firstName"
                                            value={data.firstName}
                                            className="mt-1 block w-full"
                                            autoComplete="firstName"
                                            isFocused={true}
                                            handleChange={onHandleChange}
                                            required
                                        />
                                        <p className='text-red-500 font-bold text-xs mt-2'>{errors['firstName']}</p>
                                    </div>

                                    <div className="mt-3 w-1/2">
                                        <Label forInput="lastName" value={lang.get('strings.Last-Name')} />

                                        <Input
                                            type="text"
                                            name="lastName"
                                            value={data.lastName}
                                            className="mt-1 block w-full"
                                            autoComplete="lastName"
                                            isFocused={true}
                                            handleChange={onHandleChange}
                                            required
                                        />
                                        <p className='text-red-500 font-bold text-xs mt-2'>{errors['lastName']}</p>
                                    </div>
                                </div>
                                <div className="flex gap-3 justify-between">

                                    <div className="mt-2 w-1/2">
                                        <Label forInput="email" value="Email" />

                                        <Input
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            className="mt-1 block w-full"
                                            autoComplete="username"
                                            handleChange={onHandleChange}
                                            required
                                        />
                                        <p className='text-red-500 font-bold text-xs mt-2'>{errors['email']}</p>
                                    </div>

                                    <div className="mt-2 w-1/2">
                                        <Label forInput="phoneNumber" value={lang.get('strings.Phone')} />

                                        <Input
                                            type="text"
                                            name="phoneNumber"
                                            value={data.phoneNumber}
                                            className="mt-1 block w-full"
                                            autoComplete="phoneNumber"
                                            handleChange={onHandleChange}
                                            required
                                        />
                                        <p className='text-red-500 font-bold text-xs mt-2'>{errors['phoneNumber']}</p>
                                    </div>
                                </div>
                                <div className="flex gap-3 justify-between">

                                    <div className="mt-2 w-1/2">
                                        <Label forInput="password" value={lang.get('strings.Password')} />

                                        <Input
                                            type="password"
                                            name="password"
                                            value={data.password}
                                            className="mt-1 block w-full"
                                            autoComplete="new-password"
                                            handleChange={onHandleChange}
                                            required
                                        />
                                    </div>

                                    <div className="mt-2 w-1/2">
                                        <Label forInput="password_confirmation" value={lang.get('strings.Confirm-Password')} />

                                        <Input
                                            type="password"
                                            name="password_confirmation"
                                            value={data.password_confirmation}
                                            className="mt-1 block w-full"
                                            handleChange={onHandleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <p className='text-red-500 font-bold text-xs mt-2'>{errors['password']}</p>

                                <div className="mt-2">
                                    <Label forInput="salonName" value={lang.get('strings.Salon-Name')}/>

                                    <Input
                                        type="text"
                                        name="salonName"
                                        value={data.salonName}
                                        className="mt-1 block w-full"
                                        autoComplete="salonName"
                                        handleChange={onHandleChange}
                                        required
                                    />
                                </div>

                                <div className="mt-2">
                                    <Label forInput="address" value={lang.get('strings.Address')}/>

                                    <Input
                                        type="text"
                                        name="address"
                                        value={data.address}
                                        className="mt-1 block w-full"
                                        autoComplete="address"
                                        handleChange={onHandleChange}
                                        required
                                    />
                                    <p className='text-red-500 font-bold text-xs mt-2'>{errors['address']}</p>
                                </div>

                                <div className="mt-2 flex gap-x-4">
                                    <div className="w-1/2">
                                        <Label forInput="staffNumber" value={lang.get('strings.Staff-Number')} />

                                        <Input
                                            type="number"
                                            name="staffNumber"
                                            value={data.staffNumber}
                                            className="mt-1 block w-full"
                                            autoComplete="staffNumber"
                                            handleChange={onHandleChange}
                                            required
                                        />
                                    </div>
                                    <div className="w-1/2">
                                        <Label forInput="seatNumber" value={lang.get('strings.Seat-Number')} />

                                        <Input
                                            type="number"
                                            name="seatNumber"
                                            value={data.seatNumber}
                                            className="mt-1 block w-full"
                                            autoComplete="seatNumber"
                                            handleChange={onHandleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="mt-2">
                                    <Label className="mb-3" forInput="registrationPackage" value={lang.get('strings.Registration-Package')} />

                                    <Select
                                        placeholder="Select a package"
                                        onChange={onSelectedPackageChange}
                                        options={registrationPackages}
                                        size='large'
                                        className='w-1/3'
                                    />
                                </div>

                                <div className="flex items-center justify-end mt-4">
                                    <Link href={route('login')} className="underline text-sm text-gray-600 hover:text-gray-900">
                                        {lang.get('strings.Already-registered')}
                                    </Link>

                                    <Button className="ml-4 bg-sky-900 border-2 border-sky-900 hover:bg-white hover:text-sky-900 text-white" processing={processing}>
                                        {lang.get('Register')}
                                    </Button>
                                </div>
                            </form>
                        </div>
                   </div>
                   <div>

                   </div>
                </div>
                <footer className="bg-white shadow dark:bg-gray-200 fixed bottom-0 left-0 z-20 w-full">
                        <div className="w-full mx-auto max-w-screen-xl md:flex md:items-center md:justify-between">
                            <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
                                <Select
                                    defaultValue="English"
                                    style={{
                                        width: 120,
                                    }}
                                    value={selectedLocale}
                                    onChange={handleLocaleChange}
                                    options={[
                                        {
                                            value: 'en',
                                            label: 'English',
                                        },
                                        {
                                            value: 'vi',
                                            label: 'Tiếng Việt',
                                        },
                                    ]}
                                />
                            </span>
                        </div>
                    </footer>
            </div>
        </>
    );
}
