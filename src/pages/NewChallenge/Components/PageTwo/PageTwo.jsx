import "./PageTwo.scss";
import Input from "../../../../components/Input/Input";
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { DateRange } from 'react-date-range';
import { useState, useEffect } from "react";
import Select from 'react-select'
import axios from "axios";
import { useAuthUser } from "react-auth-kit";

const PageTwo = ({categories, selectedCategory, types, type, pageTwoStates, setPageTwoStates}) => {
    const [subCategories, setSubCategories] = useState([]);
    const [measurements, setMeasurements] = useState([]);
    const [calculateTypes, setCalculateTypes] = useState([]);
    const authUser = useAuthUser();
    const [teams, setTeams] = useState([]);
    const [teamsOption, setTeamsOption] = useState([]);

    const customStyles = {
        option: (provided, state) => ({
          ...provided,
          color: state.isSelected ? '#725095' : '#725095',
          background: state.isSelected ? '#F0EFFF' : 'white',
          ':hover': {
            background: "#F0EFFF"
          }
        })
    }

    const changeSubCategory = (e) => {
        if(e) {
            setPageTwoStates({ ...pageTwoStates, selectedSub: e });

            const msr = [];
            categories[selectedCategory].sub_categories[e.value].measurements.forEach((measurement, i) => {
                const obj = { value: i, label: measurement.name };
                msr.push(obj);
            });

            setMeasurements(msr);
        }
    }

    useEffect(() => {
        if(type === 2) {
            axios
            .get(`${process.env.REACT_APP_API_URL}/teams/owner/${authUser().user_id}`)
            .then(res => setTeams(res.data))
            .catch(err => console.error(err));
        } else {
            setPageTwoStates({...pageTwoStates, selectedTeam: { value: null, label: "0" }})
        }
    }, [type]);

    useEffect(() => {
        if(type === 2) {
            const teamsObj = [];
            teams.forEach(team => {
                teamsObj.push({ value: team._id, label: team.team_name});
            });
            setTeamsOption(teamsObj);
        } else {
            setPageTwoStates({...pageTwoStates, selectedTeam: { value: null, label: "0" }})
        }
    }, [teams]);

    useEffect(() => {
        if(type === 2) {
            setPageTwoStates({...pageTwoStates, selectedTeam: teamsOption[0]})
        } else {
            setPageTwoStates({...pageTwoStates, selectedTeam: { value: null, label: "0" }})
        }
    }, [teamsOption]);

    useEffect(() => {
        const subs = [];

        categories[selectedCategory].sub_categories.forEach((sub, i) => {
            const obj = { value: i, label: sub.name };
            subs.push(obj);
        });

        setSubCategories(subs);
    }, [selectedCategory])

    useEffect(() => {
        changeSubCategory(subCategories[0]);
    }, [subCategories]);

    useEffect(() => {
        setPageTwoStates({ ...pageTwoStates, selectedMeasurement: measurements[0] });
    }, [pageTwoStates.selectedSub, measurements]);

    useEffect(() => {
        const calTypes = [];
        categories[selectedCategory].sub_categories[pageTwoStates.selectedSub && pageTwoStates.selectedSub.value] && categories[selectedCategory].sub_categories[pageTwoStates.selectedSub && pageTwoStates.selectedSub.value].measurements[pageTwoStates.calculateBy.value].calculate_by.forEach((type, i) => {
            const obj = { value: i, label: type };
            calTypes.push(obj);
        });

        setPageTwoStates({ ...pageTwoStates, calculateBy: calTypes[0]});
        setCalculateTypes(calTypes);
    }, [pageTwoStates.selectedMeasurement])

    useEffect(() => {
        if(pageTwoStates.calculateBy.label === "Percentage") {
            setPageTwoStates({ ...pageTwoStates, start_measurement: ""});
        } else {
            setPageTwoStates({ ...pageTwoStates, start_measurement: 0});
        }
    }, [pageTwoStates.calculateBy]);

    return (
        <div className="page-two">
            <div className="page-two__initial">
                <span className="page-two__initial-data">
                    <p className="page-two__initial-data-title">Type</p>
                    <p className="page-two__initial-data-value">{ types[type] }</p>
                </span>
                <span className="page-two__initial-data">
                    <p className="page-two__initial-data-title">Category</p>
                    <p className="page-two__initial-data-value">{ categories[selectedCategory].name }</p>
                </span>
            </div>
            <div className="page-two__form">
                { type === 2 ? <Select options={teamsOption && teamsOption} styles={customStyles} placeholder="Select Team" value={teamsOption} onChange={(e) => setPageTwoStates({ ...pageTwoStates, selectedTeam: e })}/> : "" } 
                <Select options={subCategories && subCategories} styles={customStyles} placeholder="Select Sub Category" value={pageTwoStates.selectedSub} onChange={(e) => changeSubCategory(e)}/>
                <Select options={measurements && measurements} styles={customStyles} placeholder="Select Measurement Type" value={pageTwoStates.selectedMeasurement} onChange={(e) => setPageTwoStates({ ...pageTwoStates, selectedMeasurement: e })} />
                Measure By:
                <Select options={calculateTypes && calculateTypes} styles={customStyles} placeholder="Measure By" value={pageTwoStates.calculateBy} onChange={(e) => setPageTwoStates({ ...pageTwoStates, calculateBy: e })} />

                { type === 0 ? <Input placeholder="Goal" type="number" min="0" style={{ width: "100%" }} value={pageTwoStates.goal} onChange={(e) => { e.target.value < 0 ? e.target.value = 0 : setPageTwoStates({ ...pageTwoStates, goal: e.target.value }) }} /> : "" }
                
                {
                    pageTwoStates.calculateBy.label === "Percentage" ?
                    <Input placeholder={`Enter ${categories[selectedCategory].sub_categories[pageTwoStates.selectedSub && pageTwoStates.selectedSub.value] && categories[selectedCategory].sub_categories[pageTwoStates.selectedSub && pageTwoStates.selectedSub.value].measurements[pageTwoStates.selectedMeasurement && pageTwoStates.selectedMeasurement.value].percentage_input_field}`} type="number" min="0" style={{ width: "100%" }} value={pageTwoStates.start_measurement} onChange={(e) => { e.target.value < 0 ? e.target.value = 0 : setPageTwoStates({ ...pageTwoStates, start_measurement: e.target.value }) }} />
                    : ""
                }

                <DateRange
                    color="#725095"
                    rangeColors={["#725095"]}
                    ranges={pageTwoStates.dates}
                    onChange={e => setPageTwoStates({ ...pageTwoStates, dates: [e.selection] })}
                    moveRangeOnFirstSelection={false}
                    style={{ border: "2px solid #A7A3FF", borderRadius: "5px" }}
                />
                <Input placeholder="Enter Title" style={{ width: "100%" }} value={pageTwoStates.name} onChange={(e) => setPageTwoStates({ ...pageTwoStates, name: e.target.value })} />
                <Input placeholder="Enter Wager ($ USD)" type="number" min="0" style={{ width: "100%" }} value={pageTwoStates.wager} onChange={(e) => { e.target.value < 0 ? e.target.value = 0 : setPageTwoStates({ ...pageTwoStates, wager: e.target.value }) }} />
            </div>
        </div>
    );
}

export default PageTwo;