
import Link from "next/link";
import Manager from "@/components/admin/manager";

export default function AdminProducts() {
  return (
    <>
      <div className="mb-5">
        <Link
          href="/admin/product-fields"
          className="btn btn-outline"
        >
          Manage product fields
        </Link>
      </div>
      <Manager resource="products" />
    </>
  );
}
