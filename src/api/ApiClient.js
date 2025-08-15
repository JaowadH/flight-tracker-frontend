const RAW_BASE=process.env.REACT_APP_API_BASE_URL||"";
const BASE=RAW_BASE.replace(/\/+$/,"");

async function parseBody(res){
    if(res.status===204) return null;
    const ct=res.headers.get("content-type")||"";
    if(ct.includes("application/json")){
        try{ return await res.json(); }catch{return null;}
    }
    try{ return await res.text(); }catch{return null;}
}

async function request(path,{method="GET",body,headers}={}){
    const url=`${BASE}${path}`;
    const opts={
        method,
        headers:{
            Accept:"application/json",
            ...(body?{"Content-Type":"application/json"}:{}),
            ...headers
        },
        ...(body?{body:JSON.stringify(body)}:{})
    };

    const res=await fetch(url,opts);
    const payload=await parseBody(res);

    if(!res.ok){
        const msg=(payload&&payload.message)
            ||(typeof payload==="string"&&payload)
            ||`${res.status} ${res.statusText}`;
        const err=new Error(msg);
        err.status=res.status;
        err.url=url;
        err.payload=payload;
        throw err;
    }
    return payload;
}

const get=path=>request(path);
const post=(path,body)=>request(path,{method:"POST",body});
const del=path=>request(path,{method:"DELETE"});

const Api={
    // Reads
    getAirports:()=>get("/airports"),
    getAircraft:()=>get("/aircraft"),
    getPassengers:()=>get("/passengers"),

    // Creates
    createAirport:(data)=>post("/airports",data),
    createAircraft:(data)=>post("/aircraft",data),
    createPassenger:(data)=>post("/passengers",data),

    // Deletes
    deleteAirport:(id)=>del(`/airports/${id}`),
    deleteAircraft:(id)=>del(`/aircraft/${id}`),
    deletePassenger:(id)=>del(`/passengers/${id}`)
};

export default Api;
