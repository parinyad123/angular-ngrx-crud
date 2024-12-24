import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { EmployeeService } from "../service/employee.service";
import { catchError, exhaustMap, map, of, switchMap } from "rxjs";
import { addEmployee, addEmployeeSuc, deleteEmployee, deleteEmployeeSuc, emptyAction, 
    loadEmployee, loadEmployeeFail, loadEmployeeSuc, 
    updateEmployee,
    updateEmployeeSuc} from "./Employee.Action";
import { ToastrService } from "ngx-toastr";

@Injectable()
export class empEffect {
    // constructor(private actions$: Actions, private service: EmployeeService) {}

    actions$ = inject(Actions);
    service = inject(EmployeeService)
    toastr = inject(ToastrService)

    // createEffect ใช้สำหรับสร้าง Effect ที่จะทำงานเมื่อมี action ถูก dispatch เข้ามา
    _loadEmployee = createEffect(() => 
        this.actions$.pipe( // this.actions$ คือ observable ของทุกๆ action ที่ถูก dispatch.
            ofType(loadEmployee), // ofType ใช้สำหรับกรอง action ที่ต้องการจะทำงาน
            exhaustMap(() => { // exhaustMap: ใช้เพื่อจัดการกับการทำงานที่ต้องใช้ side effect (ในที่นี้คือการเรียก API).
                return this.service.GetAll().pipe(
                    map((data) => {
                        return loadEmployeeSuc({ list: data });
                    }),
                    catchError((err) => of(loadEmployeeFail({ errMsg: err.message })))
                );
            })
        )
    );

    _deleteEmployee = createEffect(() => // _deleteEmployee: Effect นี้จะทำงานเมื่อ deleteEmployee ถูก dispatch.
        this.actions$.pipe( // this.actions$ คือ observable ของทุกๆ action ที่ถูก dispatch.
            ofType(deleteEmployee), 
            switchMap((action) => { // ใช้ switchMap เพื่อเรียก API สำหรับการลบพนักงาน (this.service.Delete(action.empId)).
                return this.service.Delete(action.empId).pipe(
                    switchMap((data) => { 
                        return of(deleteEmployeeSuc({ empId: action.empId }), // ถ้าการลบสำเร็จ, จะ dispatch deleteEmployeeSuc
                        this.Showalert('Deleted Successfully.', 'pass') // และแสดง alert ว่า "Deleted Successfully."
                    );
                    }),
                    catchError((err) => of(this.Showalert(err.message, 'fail'))) // ถ้าการลบไม่สำเร็จ, แสดง alert ว่า "Deleted Failed."
                );
            })
        )
    );

    _addEmployee = createEffect(() => // _addEmployee: Effect นี้จะทำงานเมื่อ addEmployee ถูก dispatch.
        this.actions$.pipe( // this.actions$ คือ observable ของทุกๆ action ที่ถูก dispatch.
            ofType(addEmployee), 
            switchMap((action) => { // ใช้ switchMap เพื่อเรียก API สำหรับการเพิ่มพนักงาน (this.service.Create(action.data)).
                return this.service.Create(action.data).pipe(
                    switchMap((data) => {
                        return of(addEmployeeSuc({ data: action.data }),
                        this.Showalert('Created Successfully.', 'pass')
                    );
                    }),
                    catchError((err) => of(this.Showalert(err.message, 'fail')))
                );
            })
        )
    );

    _updateEmployee = createEffect(() =>
        this.actions$.pipe(
            ofType(updateEmployee), 
            switchMap((action) => {
                return this.service.Update(action.data).pipe(
                    switchMap((data) => {
                        return of(updateEmployeeSuc({ data: action.data }),
                        this.Showalert('Updated Successfully.', 'pass')
                    );
                    }),
                    catchError((err) => of(this.Showalert(err.message, 'fail')))
                );
            })
        )
    );

    Showalert(message:string, response:string) {
        if(response == 'pass') {
            this.toastr.success(message);
        } else {
            this.toastr.error(message);
        }
        return emptyAction();
    }
}