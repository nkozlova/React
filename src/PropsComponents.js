import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';


const Header = ({ logo, title }) => (
    <div style={{ backgroundColor: 'beige' }}>
        <img src={logo} alt="No logo" style={{ width:90, height:90 }} />
        <h1>{title}</h1>
    </div>
);

const Nav = ({ menu }) => (
    <div style={{ backgroundColor: 'grey' }}>
        {menu.map(item => (
            <div key={item.title}>
                <a href={item.link}>{item.title}</a>
            </div>
        ))}
    </div>
);

const Footer = () => (
    <div style={{ backgroundColor: 'green', position: 'fixed', bottom: 0 }}>
        @Copyright {new Date().getFullYear()}
    </div>
);

const CustomTitle = ({ text, size, color='black' }) => (
    <h1 style={{ fontSize: size, color: color }}>
        {text}
    </h1>
);

function CustomInput({ type, placeholder, value }) {
    const [val, setVal] = useState(value);

    return (
        <input type={type} placeholder={placeholder} value={val} onChange={e => (setVal(e.target.value))} />
    );
}

function Star({ color }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
        >
            <polygon
                points="12,2 15,8 22,8 17,12 18,19 12,15 6,19 7,12 2,8 9,8"
                fill={color}
            />
        </svg>
    );
}

function CustomRate({ max, current }) {
    let stars = [];

    for (let i = 0; i < max; i++) {
        stars.push(<Star key={i} color={i < current ? 'gold' : 'grey'} />);
    }

    return (
        <div>{stars}</div>
    );
}

function CustomTags({ tags }) {
    let t=[];
    tags.forEach(tag => {
        t.push(<button key={tag.title} onClick={() => window.open(tag.href, '_blank')}>{tag.title}</button>);
    });
    return (
        <div>
            {t}
        </div>
    );
}

function CustomBreadcrump({ menu }) {
    let prevs = [];

    for (let i = 0; i < menu.length - 1; i++) {
        prevs.push(<li key={i} class="breadcrumb-item"><a href={menu[i].link}>{menu[i].title}</a></li>);
    }

    return (
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
                { prevs }
                <li class="breadcrumb-item active" aria-current="page">{ menu[menu.length - 1].title}</li>
            </ol>
        </nav>
    );
}

function CustomPagination({ countArticles, limit }) {
    let pages = [];

    for (let i = 0; i < (countArticles) / limit; i++) {
        pages.push(<li class="page-item"><a class="page-link" href="#">{i + 1}</a></li>);
    }

    return (
        <nav aria-label="Page navigation example">
            <ul class="pagination">
                <li class="page-item"><a class="page-link" href="#">Previous</a></li>
                { pages }
                <li class="page-item"><a class="page-link" href="#">Next</a></li>
            </ul>
        </nav>
    );
}

const Content = () => (
    <div>
        <div class="alert alert-dark" role="alert">
            fesd
        </div>

        <button type="button" class="btn btn-primary">main</button>

        <div class="card">
            <div class="card-body">
                This is some text within a card body.
            </div>
        </div>

        <CustomTitle text="My title" size={20} color='red' />
        <CustomInput type="password" placeholder="place text here" value="fdsdf" />
        <CustomRate max={4} current={3} />
        <CustomTags tags={[
            { title: 't1', href: 'http://link1.ru' },
            { title: 't2', href: 'http://link2.ru' },
            { title: 't3', href: 'http://link3.ru' },
        ]} />
        <CustomBreadcrump menu={[{ title: "Tasks", link: "https://daruse.ru/zadaniya-po-react-dlya-prokachki" },
            { title: "Common info", link: "https://daruse.ru/react/" },
            { title: "Hooks", link: "https://daruse.ru/poluchenie-dannyix-s-servera-react-hooks" },
            { title: "Components", link: "https://daruse.ru/svojstva-komponentov-v-react" }
        ]} />
        <CustomPagination countArticles={49} limit={10} />
    </div>
);

export default function App() {
    return (
        <div>
            <Header logo="https://www.w3schools.com/howto/img_nature_wide.jpg" title="My BEST title!" />
            <Nav menu={[{ title: "Tasks", link: "https://daruse.ru/zadaniya-po-react-dlya-prokachki" },
                { title: "Common info", link: "https://daruse.ru/react/" },
                { title: "Hooks", link: "https://daruse.ru/poluchenie-dannyix-s-servera-react-hooks" },
                { title: "Components", link: "https://daruse.ru/svojstva-komponentov-v-react" }
            ]} />

            <Content/>

            <Footer />
        </div>
    );
}