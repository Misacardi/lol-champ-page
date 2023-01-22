import './heroesList.css'
import { useHttp } from '../../hooks/http.hook'
import Spinner from '../loading/spinner'
import HeroListItem from "../heroListCard/heroListCard";
import { championsFetched, championFetching, changeStatusFilter } from "../../action";
import { useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux";

const HeroList = () => {
    const filterButton = ['all', 'assasin', 'mage', 'tank', 'marksman'];
    const { request } = useHttp()
    const dispatch = useDispatch()

    const { loadingStatus, filterStatus } = useSelector(state => state)


    const filterChampion = useSelector(state => {

        if (filterStatus === 'all') {
            return state.champions;
        } else {
            return state.champions.filter(item => item.role === filterStatus)
        }
    })


    useEffect(() => {
        dispatch(championFetching())
        request('http://localhost:3001/champions')
            .then(data => dispatch(championsFetched(data))) // eslint-disable-next-line
    }, []) 




    const elem = filterChampion.map(({ id, name, img }) => {
        return (
            <HeroListItem key={id} name={name} img={img} id={id} />
        )
    })


    return (
        <>

            <div className="container">


                <div className="banner">
                    <div className="banner__text">
                        <h1 className="banner__title">
                            <span>
                                Choose your
                            </span>
                            <div className="banner__champion">
                                champion
                            </div>
                        </h1>

                    </div>
                    <div className="banner__description">
                        With more than 140 champions, you’ll find the perfect match for your playstyle. Master one, or master them all.
                    </div>


                </div>

                <div className="filter">

                    {filterButton.map((item, i) => {
                        return (
                            <button key={i} className="filter__button" onClick={() => dispatch(changeStatusFilter(item))}>{item}</button>
                        )
                    })}
                </div>



                <ul className="cards">
                    {loadingStatus ? <Spinner /> : elem}

                </ul>



            </div>



        </>
    )


}

export default HeroList