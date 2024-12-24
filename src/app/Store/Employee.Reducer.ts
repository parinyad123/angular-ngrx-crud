import { createReducer, on } from "@ngrx/store";
import { employeeState } from "./Employee.State";
import { loadEmployeeSuc, loadEmployeeFail, deleteEmployeeSuc, addEmployeeSuc, updateEmployeeSuc, getEmployee } from "./Employee.Action";

const _employeeReducer = createReducer(employeeState, // createReducer ใช้สำหรับสร้าง reducer ที่จะทำงานเมื่อมี action ถูก dispatch เข้ามา
    on(loadEmployeeSuc, (state, action) => { // on ใช้สำหรับกำหนดการทำงานของ reducer เมื่อมี action ถูก dispatch เข้ามา
        return {
            ...state, // ...state ใช้ในการคัดลอกค่าเดิมของ state เพื่อให้ไม่เกิดการเปลี่ยนแปลงค่าของ state
            list: action.list, // action.list ใช้สำหรับการรับข้อมูลจาก action ที่ถูก dispatch เข้ามา
            errormessage: '' // errormessage ใช้สำหรับการกำหนดข้อความของ error message
        };
    }),
    on(loadEmployeeFail, (state, action) => { 
        return {
            ...state,
            list: [], 
            errormessage: action.errMsg 
        };
    }),
    on(deleteEmployeeSuc, (state, action) => {
        const _newdata = state.list.filter(o => o.id != action.empId) // state.list เป็นอาเรย์ที่เก็บข้อมูลพนักงานทั้งหมด. filter() จะสร้างอาเรย์ใหม่ที่ไม่มีพนักงานที่มี id ตรงกับ empId
        return {
            ...state,
            list: _newdata, //  อัปเดต list ด้วยอาเรย์ใหม่ (_newdata) ที่กรองออกพนักงานที่ถูกลบ
            errormessage: '' // ล้างข้อความข้อผิดพลาด (errormessage) ให้เป็นค่าว่าง หลังจากการลบสำเร็จ.
        };
    }),
    on(addEmployeeSuc, (state, action) => {
        const _newdata = { ...action.data } //ใช้ spread operator (...) เพื่อทำการคัดลอกข้อมูลจาก action.data มาสร้างอ็อบเจ็กต์ใหม่ _newdata. นี่คือขั้นตอนที่ช่วยป้องกันไม่ให้ข้อมูลเดิมถูกเปลี่ยนแปลงโดยตรง (การทำให้ state เป็น immutable).
        return {
            ...state,
            list: [...state.list, _newdata], 
            errormessage: ''
        };
    }),
    on(updateEmployeeSuc, (state, action) => {
        const _newdata = state.list.map(o=>{ // map() เพื่อวนผ่านรายการพนักงานใน list และตรวจสอบว่า id ของพนักงานในรายการตรงกับ action.data.id หรือไม่
            return o.id === action.data.id ? action.data : o // ถ้า id ตรงกัน จะสร้างอ็อบเจ็กต์ใหม่ที่มีข้อมูลจาก action.data มาแทนที่อ็อบเจ็กต์เดิม ถ้าไม่ตรงกัน จะคืนค่าเดิมของ o
        })
        return {
            ...state,
            list: _newdata,
            errormessage: ''
        };
    }),
    on(getEmployee, (state, action) => {
        let _newdata = state.list.find(o => o.id === action.empId); // find() จะหาพนักงานที่มี id ตรงกับ empId และเก็บไว้ใน _newdata. หากพบจะได้ข้อมูลของพนักงานที่ตรงกับ empId.
        if (_newdata == null) { // ถ้าไม่พบพนักงานใน state.list ที่มี id ตรงกับ empId, จะตั้งค่า _newdata ให้เป็น state.empobj ซึ่งเป็นข้อมูลพนักงานเริ่มต้น
            _newdata = state.empobj;
        }
        return {
            ...state,
            empobj: _newdata // อัปเดต empobj (ข้อมูลพนักงานที่แสดงใน UI) ด้วยข้อมูลจาก _newdata,
        };
    })
);

export function employeeReducer(state: any, action: any) {
    return _employeeReducer(state, action);
}