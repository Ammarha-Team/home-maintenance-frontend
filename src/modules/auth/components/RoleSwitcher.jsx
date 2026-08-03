import SegmentedControl from '../../../shared/components/SegmentedControl.jsx'
import ScrewdriverWrenchIcon from '../../../shared/components/icons/ScrewdriverWrenchIcon.jsx'
import UserIcon from '../../../shared/components/icons/UserIcon.jsx'

// Role switcher from the Figma shared library (node 4:957) — chooses which sign
// up flow the user is in. `value` is 'customer' | 'technician'.
// Customer is listed first so it lands on the right of the RTL control.
const ROLE_OPTIONS = [
  { id: 'customer', label: 'عميل', Icon: UserIcon },
  { id: 'technician', label: 'فني', Icon: ScrewdriverWrenchIcon },
]

function RoleSwitcher({ value, onChange, className = '' }) {
  return (
    <SegmentedControl
      options={ROLE_OPTIONS}
      value={value}
      onChange={onChange}
      ariaLabel="نوع الحساب"
      className={className}
    />
  )
}

export default RoleSwitcher
