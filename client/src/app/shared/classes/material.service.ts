import {ElementRef} from "@angular/core";

declare var M

//интерфейс для работы с компонентом js
export interface MaterialInstance {
  open?():void
  close?():void
  destroy?():void
}

export interface MaterialDatepicker extends MaterialInstance{
  date?: Date
}


export class MaterialService {
  //для логов(всплывающие окна)
  static toast(message: string) {
    M.toast({"html": message})
  }
  //инициализация кнопки +
  static initializeFloatingButton(rel: ElementRef) {
    //инициализируем
    M.FloatingActionButton.init(rel.nativeElement)
  }
  //обновление полей input от placeholder
  static updateTextInputs () {
    M.updateTextFields()
  }
  //инициализация вспл окна для создания позиций
  static initModal(ref: ElementRef) : MaterialInstance {
   return M.Modal.init(ref.nativeElement)
  }

  static initTooltip(ref : ElementRef) : MaterialInstance {
    return M.Tooltip.init(ref.nativeElement)
  }

  static initDatepicker(ref : ElementRef, onClose : () => {}) : MaterialDatepicker {
   return M.Datepicker.init(ref.nativeElement, {
      format: 'dd.mm.yyyy',
      showClearBtn: true,
      onClose
    })
  }
  static initTapTarget(ref : ElementRef) : MaterialInstance {
    return M.TapTarget.init(ref.nativeElement)
  }

}
