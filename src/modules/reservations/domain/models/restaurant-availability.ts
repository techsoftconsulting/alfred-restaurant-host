export default interface RestaurantAvailability {
    tables: { id: string; name: string; availableSlots: string[] }[];
}