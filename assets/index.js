import Resistor from './resistor.svg';
import Inductor from './inductor.svg';
import Capacitor from './capacitor.svg';
import PolarizedCapacitor from './polarized-capacitor.svg';
import Reactance from './reactance.svg';
import EarthGround from './earth-gnd.svg';
import ChassisGround from './chassis-gnd.svg';
import ACVoltageSource from './vac.svg';
import DCVoltageSource1 from './vdc1.svg';
import DCVoltageSource2 from './vdc2.svg';
import ACCurrentSource from './iac.svg';
import DCCurrentSource from './idc.svg';
import Voltmeter from './voltmeter.svg';
import Ammeter from './ammeter.svg';

export const svgMap = new Map([
  ['Resistor', Resistor],
  ['Inductor', Inductor],
  ['Capacitor', Capacitor],
  ['PolarizedCapacitor', PolarizedCapacitor],
  ['Reactance', Reactance],
  ['Chassis Ground', ChassisGround],
  ['Earth Ground', EarthGround],
  ['AC Voltage Source', ACVoltageSource],
  ['DC Voltage Source', [DCVoltageSource1, DCVoltageSource2]],
  ['AC Current Source', ACCurrentSource],
  ['DC Current Source', DCCurrentSource],
  ['Voltmeter', Voltmeter],
  ['Ammeter', Ammeter],
]);
