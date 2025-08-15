import {useEffect,useMemo,useState,useCallback,useRef} from 'react';
import Api from '../api/ApiClient';
import '../styles/Table.css';
import '../styles/Admin.css';

const ENTITIES=['airports','aircraft','passengers'];

/** @typedef {{
 *  name:string, portId:string,
 *  type:string, airlineName:string, numOfPassengers:string,
 *  firstName:string, lastName:string, phoneNumber:string
 * }} FormState */

/** @type {FormState} */
const initialForm={
    name:'',portId:'',
    type:'',airlineName:'',numOfPassengers:'',
    firstName:'',lastName:'',phoneNumber:''
};

export default function AdminPage(){
    const [entity,setEntity]=useState('airports');
    const [rows,setRows]=useState([]);
    const [loading,setLoading]=useState(false);
    const [error,setError]=useState(null);

    const firstFieldRef=useRef(null);
    /** @type {[FormState,Function]} */
    const [form,setForm]=useState(initialForm);

    const columns=useMemo(()=>{
        if(entity==='aircraft') return [
            {key:'id',label:'id',width:90,align:'center'},
            {key:'type',label:'type'},
            {key:'airlineName',label:'airline',width:220},
            {key:'numOfPassengers',label:'# passengers',width:150,align:'right'},
            {key:'_actions',label:'Actions',width:140,align:'center'}
        ];
        if(entity==='passengers') return [
            {key:'id',label:'id',width:90,align:'center'},
            {key:'firstName',label:'first'},
            {key:'lastName',label:'last'},
            {key:'phoneNumber',label:'phone',width:180},
            {key:'_actions',label:'Actions',width:140,align:'center'}
        ];
        return [
            {key:'id',label:'id',width:90,align:'center'},
            {key:'name',label:'name'},
            {key:'portId',label:'portId',width:120,align:'center'},
            {key:'_actions',label:'Actions',width:140,align:'center'}
        ];
    },[entity]);

    const load=useCallback(async()=>{
        setLoading(true); setError(null);
        try{
            let data;
            if(entity==='airports') data=await Api.getAirports();
            else if(entity==='aircraft') data=await Api.getAircraft();
            else data=await Api.getPassengers();
            setRows(Array.isArray(data)?data:[]);
        }catch(e){
            setError(e.message||'Failed to load'); setRows([]);
        }finally{
            setLoading(false);
        }
    },[entity]);

    useEffect(()=>{ void load(); },[load]);

    const resetForm=()=>setForm(initialForm);

    useEffect(()=>{
        resetForm();
        setTimeout(()=>{ if(firstFieldRef.current) firstFieldRef.current.focus(); },0);
    },[entity]);

    const handleChange=e=>{
        const {name,value}=e.target;
        if(name==='portId'){
            const v=(value||'').toUpperCase().slice(0,3);
            setForm(prev=>({...prev,portId:v}));
            return;
        }
        if(name==='numOfPassengers'){
            const digits=(value||'').replace(/\D/g,'');
            setForm(prev=>({...prev,numOfPassengers:digits}));
            return;
        }
        setForm(prev=>({...prev,[name]:value}));
    };

    const isValid=useMemo(()=>{
        if(entity==='airports') return form.name.trim().length>0 && form.portId.trim().length===3;
        if(entity==='aircraft') return form.type.trim().length>0 && (form.numOfPassengers==='' || !Number.isNaN(Number(form.numOfPassengers)));
        if(entity==='passengers') return form.firstName.trim().length>0 && form.lastName.trim().length>0;
        return false;
    },[entity,form]);

    const handleAdd=async e=>{
        e.preventDefault();
        if(!isValid) return;
        setLoading(true); setError(null);
        try{
            if(entity==='airports'){
                await Api.createAirport({
                    name:form.name.trim(),
                    portId:form.portId.trim().toUpperCase()
                });
            }else if(entity==='aircraft'){
                await Api.createAircraft({
                    type:form.type.trim(),
                    airlineName:form.airlineName.trim()||null,
                    numOfPassengers:form.numOfPassengers===''?0:Number(form.numOfPassengers)
                });
            }else{
                await Api.createPassenger({
                    firstName:form.firstName.trim(),
                    lastName:form.lastName.trim(),
                    phoneNumber:(form.phoneNumber||'').trim()||null
                });
            }
            resetForm();
            await load();
            setTimeout(()=>{ if(firstFieldRef.current) firstFieldRef.current.focus(); },0);
        }catch(err){
            setError(err.message||'Failed to add');
        }finally{
            setLoading(false);
        }
    };

    const handleDelete=async id=>{
        if(!window.confirm('Delete this record?')) return;
        setLoading(true); setError(null);
        try{
            if(entity==='airports') await Api.deleteAirport(id);
            else if(entity==='aircraft') await Api.deleteAircraft(id);
            else await Api.deletePassenger(id);
            await load();
        }catch(err){
            setError(err.message||'Delete failed');
        }finally{
            setLoading(false);
        }
    };

    const renderFields=()=>{
        if(entity==='airports') return (
            <>
                <div className="field">
                    <label htmlFor="f-name">Name</label>
                    <input id="f-name" ref={firstFieldRef} name="name" autoComplete="off" className="form-control"
                           value={form.name} onChange={handleChange} placeholder="Hartsfield–Jackson Atlanta"/>
                </div>
                <div className="field">
                    <label htmlFor="f-port">Port</label>
                    <input id="f-port" name="portId" autoComplete="off" className="form-control"
                           value={form.portId} onChange={handleChange} placeholder="ATL"/>
                </div>
            </>
        );
        if(entity==='aircraft') return (
            <>
                <div className="field">
                    <label htmlFor="f-type">Type</label>
                    <input id="f-type" ref={firstFieldRef} name="type" autoComplete="off" className="form-control"
                           value={form.type} onChange={handleChange} placeholder="A320-200"/>
                </div>
                <div className="field">
                    <label htmlFor="f-airline">Airline</label>
                    <input id="f-airline" name="airlineName" autoComplete="off" className="form-control"
                           value={form.airlineName} onChange={handleChange} placeholder="EuroFly"/>
                </div>
                <div className="field">
                    <label htmlFor="f-cap"># Passengers</label>
                    <input id="f-cap" name="numOfPassengers" autoComplete="off" className="form-control"
                           inputMode="numeric" value={form.numOfPassengers} onChange={handleChange} placeholder="180"/>
                </div>
            </>
        );
        return (
            <>
                <div className="field">
                    <label htmlFor="f-first">First name</label>
                    <input id="f-first" ref={firstFieldRef} name="firstName" autoComplete="off" className="form-control"
                           value={form.firstName} onChange={handleChange} placeholder="Ava"/>
                </div>
                <div className="field">
                    <label htmlFor="f-last">Last name</label>
                    <input id="f-last" name="lastName" autoComplete="off" className="form-control"
                           value={form.lastName} onChange={handleChange} placeholder="Nguyen"/>
                </div>
                <div className="field">
                    <label htmlFor="f-phone">Phone</label>
                    <input id="f-phone" name="phoneNumber" autoComplete="off" className="form-control"
                           value={form.phoneNumber} onChange={handleChange} placeholder="(optional)"/>
                </div>
            </>
        );
    };

    const Title=entity.charAt(0).toUpperCase()+entity.slice(1)+' Admin';

    return (
        <div className="page">
            <div className="table-card admin-card">
                <div className="table-card__title">{Title}</div>

                <form className="admin-form" onSubmit={handleAdd}>
                    <div className="row first">
                        <div className="field select">
                            <label htmlFor="f-entity">Entity</label>
                            <select id="f-entity" className="form-control" value={entity} onChange={e=>setEntity(e.target.value)}>
                                {ENTITIES.map(x=><option key={x} value={x}>{x.charAt(0).toUpperCase()+x.slice(1)}</option>)}
                            </select>
                        </div>
                        <div className="spacer"/>
                        <div className="actions">
                            <button className="btn btn-primary" type="submit" disabled={loading||!isValid}>Add</button>
                        </div>
                    </div>

                    <div className="row">{renderFields()}</div>
                </form>

                {error&&<div className="admin-alert">{error}</div>}

                <div className="table-wrap">
                    <table className="table-darkish">
                        <thead>
                        <tr>{columns.map(c=><th key={c.key} style={{width:c.width||'auto',textAlign:c.align||'left'}}>{c.label}</th>)}</tr>
                        </thead>
                        <tbody>
                        {loading&&rows.length===0&&<tr className="table-empty"><td colSpan={columns.length}>Loading…</td></tr>}
                        {!loading&&rows.length===0&&<tr className="table-empty"><td colSpan={columns.length}>No data</td></tr>}
                        {rows.map(r=>(
                            <tr key={r.id}>
                                {columns.map(c=>{
                                    if(c.key==='_actions'){
                                        return (
                                            <td key="_actions" style={{textAlign:c.align||'left'}}>
                                                <button className="btn btn-danger btn-compact" type="button" onClick={()=>handleDelete(r.id)}>Delete</button>
                                            </td>
                                        );
                                    }
                                    return <td key={c.key} style={{textAlign:c.align||'left'}}>{r[c.key]}</td>;
                                })}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
