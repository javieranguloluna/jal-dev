import { useState } from 'preact/hooks';
import './SuperButton.scss';

import { type TargetedEvent } from 'preact/compat';


export const prerender = false;

type FormStatus = 'pristine' | 'loading' | 'done' | 'error'

interface ContactForm {
    fields: ContactFormFields;
    status: FormStatus;
    valid: boolean;
}

export interface ContactFormFields {
    [key: string]: SuperFieldProps;
}


export const SuperForm = (props: { fields: ContactFormFields }) => {

    const [form, updateForm] = useState<ContactForm>({
        fields: props.fields,
        status: 'pristine',
        valid: false
    })

    const handleSubmit = (event: TargetedEvent<HTMLFormElement, Event>): void => {

        event.preventDefault()
        event.stopPropagation()

        const formElement = event.target as HTMLFormElement

        const valid = validate(formElement)
        updateForm({
            ...form,
            valid
        })

        if (valid) {
            updateForm({
                ...form,
                status: 'loading'
            })
    
            setTimeout(() => {
                sendForm(form.fields)
            },2000)
        }
    }

    const sendForm = (fields: ContactFormFields): any => {

          
          fetch('http://localhost:4321/submit-contact', {
            headers: {
                "Content-Type": "application/json"
            },
            method: 'POST',
            body: JSON.stringify(fields)
          })
            .then(response => response.json())
            .then(response => {
                // console.log(response)
                if (response.notion.id) {
                    updateForm({
                        ...form,
                        status: 'done'
                    })
                }
            })
            .catch(err => {
                console.error(err)
                updateForm({
                    ...form,
                    status: 'error'
                })
            });
    }

    const handleChange = (event: TargetedEvent<HTMLFormElement, Event>): void => {
        const element = (event.target! as HTMLInputElement);
        const updatedForm = {
            ...form,
            fields: {
                ...form.fields,
                [element.name]: {
                    ...form.fields[element.name],
                    value: element.value,
                    valid: element.validity.valid,
                    errors: element.validationMessage
                }
            }
        }
        updatedForm.valid = Object.values(updatedForm.fields).every(field => field.valid)
        updateForm(updatedForm)


        if (!element.validity.valid)
            element.className = 'error'
        else
            element.className = ''

    }

    const validate = (data: HTMLFormElement): boolean => {
        return Array.from(data).map(el => {
            // console.log('el', el.tagName, (el as any).validity)
            switch (el.tagName) {
                case "INPUT":
                    return (el as HTMLInputElement).validity.valid;
                case "SELECT":
                    return (el as HTMLSelectElement).validity.valid;
                case "TEXTAREA":
                    return (el as HTMLTextAreaElement).validity.valid;
                default:
                    console.log(el.tagName)
                    return true
            }
        }).every(v => v)
    }


    return (<>
        <form method="POST" onSubmit={handleSubmit} onChange={handleChange}>
            {Object.values(form.fields).map(f => <SuperField {...f} />)}
            <SuperButton status={form.status} valid={form.valid}>return</SuperButton>
        </form>
    </>)
}

export type SuperFieldProps = {
    name: string;
    value: any;
    valid: boolean;
    errors: string | null;
    atts: any | null;
} & ({
    tag: 'INPUT' | 'TEXTAREA';
} | {
    tag: 'SELECT';
    options: Array<{
        value: string;
        option: string;
    }>
})

export const SuperField = (props: SuperFieldProps) => {

    return (<>
        <div class={`field ${props.tag === 'TEXTAREA' ? 'textarea' : ''}`}>
            <div class="field-wrapper">
                <label for={props.name}>
                    <span class="blue">const</span>
                    <span class="light-blue">{props.name}</span>
                    :
                    <span class="green">string</span>
                    =                    
                    {props.tag === 'TEXTAREA' &&
                        <span class="orange">`</span>
                    }
                </label>
                <div class="input-wrapper">
                    {props.tag === 'SELECT' &&
                        <select name="contact" {...props.atts}>
                            <option value=""></option>
                            { props.options.map(o => <option value={o.value}>{o.option}</option>) }
                        </select>
                    }
                    {props.tag === 'INPUT' &&
                        <input name={props.name} {...props.atts} />
                    }
                    {props.tag === 'TEXTAREA' &&
                        <textarea name={props.name} {...props.atts}></textarea>
                    }
                    {props.tag !== 'TEXTAREA' &&
                        <span>;</span>
                    }
                </div>
                {props.tag === 'TEXTAREA' &&
                    <span>
                        <span class="orange">`</span>
                        <span>;</span>
                    </span>
                }
            </div>
            {props.errors &&
                <div class="error">{props.errors}</div>
            }
        </div>
    </>)
}

export const SuperButton = (props: { status: FormStatus; valid: boolean; children: any; }) => {


    return (
        <>
            <button
                type="submit"
                disabled={props.status !== 'error' && props.status !== 'pristine' }
                className={`superbutton ${props.valid ? 'valid' : 'invalid'} ${props.status} `}
            >
            {props.status === 'pristine' && props.children}
            {props.status === 'loading' && 'loading...'}
            {props.status === 'done' && 'done!'}
            {props.status === 'error' && 'error!'}

            </button>
        </>
    );
}

