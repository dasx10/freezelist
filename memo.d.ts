export default function memo<Call extends (value: any) => any>(call: Call): Call;
