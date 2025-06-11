
type Props = {
    children: React.ReactNode,
    when: boolean
}

export default function ShowWhen({when, children}: Props): React.ReactNode | null {
    return when ? children : null
}