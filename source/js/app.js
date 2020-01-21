import './polyfill';

import expandSection from './expand-section';
import Filter from './filter';
import Sort from './sort';
import Toggle from './toggle';
import Menu from './menu';
import Modal from "./modal";
import Steppers from "./steppers";
import Image from "./image";
import SplitButton from './splitButton';
import Dropdown from './dropdown';
import Fields from './fields';
import Slider from './slider'
import Tiles from './tile';

expandSection();

let SortInstance = new Sort;
let ToggleInstance = new Toggle;
let SplitButtonInstance = new SplitButton;
let DropdownInstance = new Dropdown;
let SliderInstance = new Slider;
let TilesInstance = new Tiles;

SortInstance.applySort();
ToggleInstance.applyToggle();
DropdownInstance.setValidTargets();
SplitButtonInstance.syncSplitButton();
SliderInstance.applySliders();
TilesInstance.initTiles();

let filter = new Filter;

// Modal
let ModalInstance = new Modal;
ModalInstance.enableModals();

// Steppers
let SteppersInstance = new Steppers;
SteppersInstance.enableStepper();

//Menu
let MenuInstance = new Menu;

const FieldsInstance = new Fields;

import './datepicker';