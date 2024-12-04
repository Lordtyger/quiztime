export function CheckBox({ label, defaultValue, onChange }: { label: string, defaultValue: boolean, onChange: () => void }) {
    return (
        <div className="checkbox-wrapper-2 label-wrapper">
            <input type="checkbox" className="sc-gJwTLC ikxBAC" defaultChecked={defaultValue} onChange={onChange} />
            <label htmlFor="remember">
                <span>{label}</span>
            </label>
        </div>
    )
}