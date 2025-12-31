import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/group2/table"

export function BookingTable() {
    return (
        <>
            <h3 className="mb-4 font-medium">Booking List & Updates</h3>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Booking List</TableHead>
                        <TableHead>Status Updates</TableHead>
                        <TableHead>Dates</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    <TableRow>
                        <TableCell>Hotel Reservation</TableCell>
                        <TableCell>Confirmed</TableCell>
                        <TableCell>12–15 Aug</TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell>Flight Ticket</TableCell>
                        <TableCell>Pending</TableCell>
                        <TableCell>12 Aug</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </>
    )
}
