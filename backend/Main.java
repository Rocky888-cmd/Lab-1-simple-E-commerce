import java.util.*;
import java.util.stream.Collectors;

public class Main {

    // This method creates a list of sample orders.
    public static List<Order> orderGenerator(int numberOfOrders) {
        // Stop the program if the given number is not valid.
        if (numberOfOrders <= 0) {
            throw new RuntimeException("Invalid value");
        }

        // This list will store all generated orders.
        var generatedOrder = new ArrayList<Order>();

        // Repeat until the list has the requested number of orders.
        for (var i = 0; i < numberOfOrders; i++) {
            // Create a random order ID from 0 to 9.
            long orderId = (long) (Math.random() * 10);

            // Create a new order with random data and add it to the list.
            generatedOrder.add(new Order(
                    orderId,
                    "Order " + orderId,
                    (int) (Math.random() * 200)
            ));
        }

        return generatedOrder;
    }

    public static void main(String[] args) {

        // Step 1: Generate 10 sample orders.
        List<Order> orders = orderGenerator(10);

        // Make a copy of the original list so we can still use it in Step 4.
        List<Order> originalOrders = new ArrayList<>(orders);

        // Print all generated orders.
        System.out.println("STEP 1: ALL ORDERS");
        for (Order order : orders) {
            System.out.println("ID: " + order.getOrderId()
                    + ", Description: " + order.getDescription()
                    + ", Amount: " + order.getAmount());
        }

        // Step 2: Add one new order to the list.
        orders.add(new Order(999L, "Special Order", 180));

        // Sort the orders from highest amount to lowest amount.
        List<Order> sortedOrders = orders.stream()
                .sorted(Comparator.comparingInt(Order::getAmount).reversed())
                .toList();

        // Print the sorted list.
        System.out.println("\nSTEP 2: SORTED ORDERS (DESCENDING)");
        for (Order order : sortedOrders) {
            System.out.println("ID: " + order.getOrderId()
                    + ", Description: " + order.getDescription()
                    + ", Amount: " + order.getAmount());
        }

        // Step 3: Get only the descriptions of orders with amount greater than 150.
        List<String> highValueOrderDescriptions = orders.stream()
                .filter(order -> order.getAmount() > 150)
                .map(Order::getDescription)
                .toList();

        // Print the filtered descriptions.
        System.out.println("\nSTEP 3: DESCRIPTIONS OF ORDERS WITH AMOUNT > 150.00");
        highValueOrderDescriptions.forEach(System.out::println);

        // Step 4: Find the average amount of the original generated orders.
        double averageAmount = originalOrders.stream()
                .mapToInt(Order::getAmount)
                .average()
                .orElse(0.0);

        // Print the average amount.
        System.out.println("\nSTEP 4: AVERAGE AMOUNT OF ORIGINAL ORDERS");
        System.out.println("Average: " + averageAmount);

        // Step 5: Group orders by description and add their amounts.
        Map<String, Integer> groupedTotals = orders.stream()
                .collect(Collectors.groupingBy(
                        Order::getDescription,
                        Collectors.summingInt(Order::getAmount)
                ));

        // Print each description and its total amount.
        System.out.println("\nSTEP 5: TOTAL AMOUNT PER DESCRIPTION");
        groupedTotals.forEach((description, totalAmount) ->
                System.out.println(description + " = " + totalAmount));
    }
}
