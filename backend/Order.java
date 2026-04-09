import java.util.Objects;

public class Order {

    // These variables store the details of one order.
    private Long orderId;
    private String description;
    private int amount;

    // This constructor runs when a new Order object is created.
    public Order(Long orderId, String description, int amount) {
        this.orderId = orderId;
        this.description = description;
        this.amount = amount;
    }

    // This getter returns the order ID.
    public Long getOrderId() {
        return orderId;
    }

    // This getter returns the order description.
    public String getDescription() {
        return description;
    }

    // This getter returns the order amount.
    public int getAmount() {
        return amount;
    }

    // This setter changes the order ID.
    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    // This setter changes the description.
    public void setDescription(String description) {
        this.description = description;
    }

    // This setter changes the amount.
    public void setAmount(int amount) {
        this.amount = amount;
    }

    // This method returns the order as readable text.
    @Override
    public String toString() {
        return "Order{" +
                "orderId=" + orderId +
                ", description='" + description + '\'' +
                ", amount=" + amount +
                '}';
    }

    // This method checks if two Order objects have the same values.
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Order)) return false;

        Order order = (Order) o;

        return amount == order.amount &&
                Objects.equals(orderId, order.orderId) &&
                Objects.equals(description, order.description);
    }

    // This method creates a hash code for collections like HashMap and HashSet.
    @Override
    public int hashCode() {
        return Objects.hash(orderId, description, amount);
    }
}
