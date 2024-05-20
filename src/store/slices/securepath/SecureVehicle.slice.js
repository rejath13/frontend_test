import { createSlice} from '@reduxjs/toolkit'


const initialState={
 pageIndex:0,
 pageSize: 25, 
}


export const VehiclePageSlice=createSlice({
    name:'vehiclepagination',
    initialState,
    reducers:{
        setPagination:(state,actions)=>{
            state.pageIndex=actions.payload
        }
    }
})

export const {setPagination}=VehiclePageSlice.actions

export default VehiclePageSlice.reducer