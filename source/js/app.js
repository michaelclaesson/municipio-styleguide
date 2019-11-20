
import "core-js";

import expandSection from './expand-section';
import Filter from './filter';
import Sort from './sort';
import Toggle from './toggle';
import Menu from './menu';
import Modal from "./modal";
import Steppers from "./steppers";
import SplitButton from './splitButton';
import Dropdown from './dropdown';

expandSection();


let SortInstance = new Sort;
let ToggleInstance = new Toggle;
let SplitButtonInstance = new SplitButton;
let DropdownInstance = new Dropdown;

SortInstance.applySort();
ToggleInstance.applyToggle();
DropdownInstance.setValidTargets();
SplitButtonInstance.syncSplitButton();

let filter = new Filter;

// Modal
let ModalInstance = new Modal;
ModalInstance.enableModals();

// Steppers
let SteppersInstance = new Steppers;
SteppersInstance.enableStepper();

//Menu
let MenuInstance = new Menu
MenuInstance.applyMenu();

