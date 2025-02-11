import './App.css';
import { useState } from 'react';

const listOfProducts = [
    { category: "Fruits", price: "$1", stocked: true, name: "Apple" },
    { category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit" },
    { category: "Fruits", price: "$2", stocked: false, name: "Passionfruit" },
    { category: "Vegetables", price: "$2", stocked: true, name: "Spinach" },
    { category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin" },
    { category: "Vegetables", price: "$1", stocked: true, name: "Peas" }
];

function UserInputStock({ stock, onStockClick, filter, onFilterChange }) {

    return (
        <form>
            <div>
                <input
                    type="text"
                    placeholder="Search..."
                    onChange={(e) => onFilterChange(e.target.value)}
                    value={filter} />
            </div>
            <div>
                <label>
                    <input
                        type="checkbox"
                        onChange={(e) => onStockClick(e.target.checked)}
                        checked={stock} />
                    Only show products in stock
                </label>
            </div>
        </form>
    );
}

function ProductCategoryRow({ category }) {
    return (
        <tr>
            <th colSpan="2">
                {category}
            </th>
        </tr>
    );
}

function ProductRow({ product }) {
    return (
        <tr>
            <td style={{ color: product.stocked ? 'black' : 'red' }}>{ product.name }</td>
            <td>{product.price}</td>
        </tr>
    );
}

function ProductLists({ products, showOnlyInStock, filter }) {
    const rows = [];
    let prevCategory = null;

    products.forEach(product => {
        if (showOnlyInStock && !product.stocked) {
            return;
        }

        if (filter != "" && product.name.toLowerCase().indexOf(filter) === -1) {
            return;
        }

        if (product.category !== prevCategory) {
            rows.push(
                <ProductCategoryRow
                    category={product.category}
                    key={product.category} />
            );
            prevCategory = product.category;
        }

        rows.push(
            <ProductRow
                product={product}
                key={product.name} />
        );
    });

    return (
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Price</th>
                </tr>
            </thead>
            <tbody>{ rows }</tbody>
        </table>
    );
}

function Shop({ products }) {
    const [onlyInStock, setOnlyInStock] = useState(false);
    const [filter, setFilter] = useState("");

    return (
        <>
            <UserInputStock
                stock={onlyInStock}
                onStockClick={setOnlyInStock}
                filter={filter}
                onFilterChange={setFilter} />
            <ProductLists
                products={products}
                showOnlyInStock={onlyInStock}
                filter={filter} />
        </>
    );
}

export default function App() {
    return <Shop products={listOfProducts} />;
}
