import React, { useState, useMemo } from 'react';
import { useEffect } from 'react';
import { useTable, useSortBy, useGlobalFilter, usePagination, useRowSelect } from 'react-table';
import { COLUMNS } from './Columns'
import './Table.css'
import GlobalFilterInput from './GlobalFilterInput'
import FullInfoFooter from './FullInfoFooter';
import AddDataForm from './AddDataForm';

export default function Table() {
    const columns = useMemo(() => COLUMNS, [])
    const [data, setData] = useState([]);
    const [activeRow, setActiveRow] = useState(null);
    const [addData, setAddData] = useState(false);

    useEffect(() => {
        fetch('https://randomuser.me/api/?results=100')
            .then(response => response.json())
            .then(res => setData(res.results));
        let d = data[0];
    }, []);

    const tableInstance = useTable({
        columns,
        data,
        initialState: { pageIndex: 0 }, // Начальная страница
    }, useGlobalFilter, useSortBy, usePagination, useRowSelect);

    const { getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        preGlobalFilteredRows,
        setGlobalFilter,
        state: { pageIndex, pageSize, globalFilter },
        page,
        nextPage,
        previousPage,
        gotoPage,
        setPageSize,
        getRowProps
    } = tableInstance;

    const handleRowClick = (rowId) => {
        setActiveRow(activeRow === rowId ? null : rowId); // Переключение активной строки
    };

    function AddNewData({ firstName, lastName, email, phone }) {
        let newData = data.slice();
        newData.unshift({ name: { first: firstName, last: lastName }, email: email, phone: phone });
        setData(newData);
        setAddData(false);
    }

    return (
        <>
            <GlobalFilterInput
                preGlobalFilteredRows={preGlobalFilteredRows}
                setGlobalFilter={setGlobalFilter}
                globalFilter={globalFilter}
            />
            <table {...getTableProps()}>
                <thead>
                    {headerGroups.map((headerGroup) => {
                        const { key: headerGroupKey, ...restHeaderGroupProps } = headerGroup.getHeaderGroupProps();
                        return <tr
                            key={headerGroupKey}
                            {...restHeaderGroupProps}
                        >
                            {headerGroup.headers.map((column) => {
                                const { key: columnKey, ...restColumnProps } = column.getHeaderProps(column.getSortByToggleProps());
                                return <th
                                    key={columnKey}
                                    {...restColumnProps}
                                >
                                    {column.render('Header')}
                                    <span>
                                        {column.isSorted ? (column.isSortedDesc
                                            ? <img
                                                draggable="false"
                                                role="img"
                                                class="emoji"
                                                alt="▼"
                                                src="https://s.w.org/images/core/emoji/14.0.0/svg/1f53d.svg" />
                                            : <img
                                                draggable="false"
                                                role="img"
                                                class="emoji"
                                                alt="▲"
                                                src="https://s.w.org/images/core/emoji/14.0.0/svg/1f53c.svg" />)
                                            : <></>}
                                    </span>
                                </th>
                            })}
                        </tr>
                    })}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {page.map(row => {
                        prepareRow(row);
                        const { key: rowKey, ...restRowProps } = row.getRowProps();
                        return (
                            <tr
                                key={rowKey}
                                {...restRowProps}
                                onClick={() => handleRowClick(row.id)}
                            >
                                {row.cells.map(cell => {
                                    const { key: cellKey, ...restCellProps } = cell.getCellProps();
                                    return (
                                        <td
                                            key={cellKey}
                                            {...restCellProps}
                                        >
                                            {cell.render('Cell')}
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {/* Пагинация */}
            <div>
                <button onClick={() => gotoPage(0)} disabled={!pageIndex}>First</button>
                <button onClick={() => previousPage()} disabled={!pageIndex}>Previous</button>
                <span>
                    Page {pageIndex + 1} of {Math.ceil(data.length / pageSize)}
                </span>
                <button onClick={() => nextPage()} disabled={pageIndex + 1 === Math.ceil(data.length / pageSize)}>Next</button>
                <button onClick={() => gotoPage(Math.ceil(data.length / pageSize) - 1)} disabled={pageIndex + 1 === Math.ceil(data.length / pageSize)}>Last</button>
            </div>

            {/* Выбор размера страницы */}
            <select
                value={pageSize}
                onChange={e => setPageSize(Number(e.target.value))}
            >
                {[5, 10, 15, 50].map(pageSizeOption => (
                    <option key={pageSizeOption} value={pageSizeOption}>
                        Show {pageSizeOption} entries
                    </option>
                ))}
            </select>

            {activeRow && <FullInfoFooter row={data[activeRow]} />}

            <div>
                <button onClick={() => setAddData(!addData)}>Add new data row</button>
                {addData && <AddDataForm onAddData={(...args) => AddNewData(...args)} />}
            </div>
        </>
    );
}
