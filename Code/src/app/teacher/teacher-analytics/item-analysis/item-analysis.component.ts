import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-item-analysis',
  templateUrl: './item-analysis.component.html',
  styleUrls: ['./item-analysis.component.css']
})
export class ItemAnalysisComponent implements AfterViewInit{
  @ViewChild('donutChartCanvas', { static: false }) donutChartCanvas: ElementRef;
  deptId: number;
  gradeLevelId: number;
  sectionId: number;
  subjectId: number;
  assignmentId: number;
  subjectName: string;
  gradeLevelName: string;
  sectionName: string;
  quarters: any[]=[]
  selectedQuarter:number;
  correctResponses: number[] = []
  totalStudents: number
  meanValues: number[] = []
  formData: {
    hps_qa_total_score: number; 
  } = {
    hps_qa_total_score: 0, 
  };
  selectedItemNumber: number | null = null;
  itemAnalysisData: any[] = [];
  donutChart: Chart<'doughnut', number[], string> | undefined;
  meanValue: number = 0;

  constructor(private route: ActivatedRoute, private authService: AuthService) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.updateDonutChart();
    }, 100);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.deptId = Number(params.get('deptId'));
      this.gradeLevelId = Number(params.get('gradelvlId'));
      this.sectionId = Number(params.get('sectionId'));
      this.subjectId = Number(params.get('subjectId'));
      this.assignmentId = Number(params.get('assignmentId'));
      
      console.log('Department:', this.deptId);
      console.log('Grade Level:', this.gradeLevelId);
      console.log('Section:', this.sectionId);
      console.log('Subject ID:', this.subjectId);
      console.log('Assignment ID:', this.assignmentId);

    });
    this.authService.getSubjectById(this.subjectId).subscribe(
      (subjectData: any) => {
        this.subjectName = subjectData.subjects[0].subject_name;
      },
      (error) => {
        console.error('Error fetching subject name:', error);
      }
    );
    this.authService.getGradeLevelById(this.gradeLevelId).subscribe(
      (gradeLevelData: any) => {
       this.gradeLevelName = gradeLevelData.gradelevelss[0].gradelvl;
      },
      (error) => {
        console.error('Error fetching grade level name:', error);
      }
    );
    this.authService.getSectionById(this.sectionId).subscribe(
      (sectionData: any) => {
        this.sectionName = sectionData.sections[0].section_name;
      },
      (error) => {
        console.error('Error fetching section name:', error);
      }
    );
    this.authService.getQuarters().subscribe((quartersData) => {
      this.quarters = quartersData;
      console.log('quarters', this.quarters);
      
        if (this.quarters && this.quarters.length > 0) {
        this.selectedQuarter = this.quarters[0].quarter_id;
        console.log('Selected Quarter ID:', this.selectedQuarter);
        this.fetchHps();
        this.getItemAnalysis()
        this.updateDonutChart()
      }

      },
      (error) => {
        console.error('Error fetching students:', error);
      }
    )

    this.authService.filterStudents(this.deptId, this.gradeLevelId, this.sectionId).subscribe(
      (studentsData: any) => {
        this.totalStudents = studentsData.students.length;
        console.log('students data', this.totalStudents)

      }
    )
  }

  onQuarterChange(){
    console.log('Selected Quarter ID:', this.selectedQuarter);

    if(this.selectedQuarter){
      this.fetchHps()
      this.getItemAnalysis()

      this.updateDonutChart();

    }
    
  }

  fetchHps(){
    const filters = {
      gradelevel: this.gradeLevelId,
      section: this.sectionId,
      subject: this.subjectId,
      quarter: this.selectedQuarter
    };

    console.log(filters)
    this.authService.fetchHPSscores(filters).subscribe(
      (data) => {
        console.log(data)
        if (data && data.length > 0) {
          this.formData.hps_qa_total_score = parseFloat(data[0].hps_qa_total_score);
        } else {
          this.formData.hps_qa_total_score = 0;
        }
      }
    )
  }

  generateItemNumbers(): number[] {
    const hpsQaTotalScore = this.formData.hps_qa_total_score; 
    const itemNumbers: number[] = [];
  
    if (!isNaN(hpsQaTotalScore) && hpsQaTotalScore > 0) {
      for (let i = 1; i <= hpsQaTotalScore; i++) {
        itemNumbers.push(i);
      }
    }
  
    return itemNumbers;
  }
  handleInputClick(itemNumber: number) {
    this.selectedItemNumber = itemNumber;
  }


  calculatePercentage(correctResponses: number): number {
    if (this.totalStudents && correctResponses !== undefined) {
      return Math.round((correctResponses / this.totalStudents) * 100);
    }
    return 0;
  }
  

  calculateMean(correctResponses: number, totalStudents: number): number {
    if (totalStudents === 0) {
      return 0; 
    }
    return Math.round((correctResponses / totalStudents) * 100);
  }
  calculateTotalMean() {
    if (this.totalStudents === 0) {
      this.meanValue = 0;
    } else {
      const sumOfCorrectResponses = this.correctResponses
        .map((val) => Number(val) || 0) 
        .reduce((sum, val) => sum + val, 0);
      console.log(sumOfCorrectResponses)
      const mean = sumOfCorrectResponses / this.totalStudents;
      this.meanValue = parseFloat(mean.toFixed(2));
    
    
    }

  }
  
  calculateMeanPercentage(): number {
    if (this.formData.hps_qa_total_score === 0) {
      return 0;
    } else {
      const meanPercentage = (this.meanValue / this.formData.hps_qa_total_score) * 100;
      return parseFloat(meanPercentage.toFixed(2)); 
    }
  }
  
  
  calculateItemCategories(correctResponses: number[]): number[] {
    const categories = [0, 0, 0]; 
  
    for (const correctResponse of correctResponses) {
      const percentage = this.calculatePercentage(correctResponse);
      if (percentage >= 75) {
        categories[0]++; 
      } else if (percentage >= 50) {
        categories[1]++; 
      } else {
        categories[2]++;
      }
    }
    return categories;
    
  }
  
  updateDonutChart() {
    const itemCategories = this.calculateItemCategories(this.correctResponses);
    console.log(itemCategories);
    const donutChartCanvas = this.donutChartCanvas.nativeElement;
  
    if (donutChartCanvas) {
      if (this.donutChart) {
        this.donutChart.destroy();
      }
  
      this.donutChart = new Chart(donutChartCanvas, {
        type: 'doughnut',
        data: {
          labels: ['MASTERED', 'BELOW MASTERY', 'NOT MASTERED'],
          datasets: [
            {
              data: itemCategories,
              backgroundColor: ['#4ad12f', '#FFCE56', '#FF6384'],
            },
          ],
        },
      });
    }
  }
  
  
  

  buildItemAnalysisData(selectedItemNumber: number): any[] {
  const itemAnalysisData: any[] = [];
  
  const itemNumbers = this.generateItemNumbers();

  for (let i = 0; i < this.correctResponses.length; i++) {
    const correctResponses = this.correctResponses[i];
    const percentageCorrect = this.calculatePercentage(correctResponses);
    const itemNumber = itemNumbers[i];

    type ItemData = {
      id?: number;
      gradelvl_id: number;
      section_id: number;
      subject_id: number;
      correct_responses: number;
      percentage_correct: number;
      item_number: number;
      quarter_id: number;
    };

    const itemData: ItemData = {
      gradelvl_id: this.gradeLevelId,
      section_id: this.sectionId,
      subject_id: this.subjectId,
      correct_responses: correctResponses, 
      percentage_correct: percentageCorrect, 
      item_number: itemNumber,
      quarter_id: this.selectedQuarter
    };

    if (this.itemAnalysisData[i] && this.itemAnalysisData[i].id) {
      itemData.id = this.itemAnalysisData[i].id;
    }

    itemAnalysisData.push(itemData);
  }

  return itemAnalysisData;
}


saveItemAnalysisData() {
  const selectedItemNumber: number = this.selectedItemNumber;
  const itemAnalysisData = this.buildItemAnalysisData(selectedItemNumber);
  const updateDataArray: any[] = [];

  console.log('correct responses', itemAnalysisData);

  for (const itemData of itemAnalysisData) {

    if (itemData.id) {
      updateDataArray.push(itemData);
    } else {
      this.authService.addItemAnalysis(itemData).subscribe(
        (response) => {
          console.log('New ItemAnalysis data added:', response);
          this.getItemAnalysis(); 
        },
        (error) => {
          console.error('Error adding New ItemAnalysis data:', error);
        }
      );
    }
    this.authService.updateItemAnalysis(updateDataArray).subscribe(
      (response) => {
        console.log('ItemAnalysis data updated:', response);
        this.getItemAnalysis();
      },
      (error) => {
        console.error('Error updating ItemAnalysis data:', error);
      }
    );
  }
}

getItemAnalysis(){
  this.authService.getItemAnalysisWithItemNumbers(this.gradeLevelId, this.sectionId, this.subjectId, this.selectedQuarter)
        .subscribe(
          (itemAnalysisData) => {
            console.log('Item Analysis with Item Numbers:', itemAnalysisData);
            this.correctResponses = new Array(itemAnalysisData.length);
            for (let i = 0; i < itemAnalysisData.length; i++) {
              this.correctResponses[i] = itemAnalysisData[i].correct_responses;
            }

            for (const item of itemAnalysisData) {
              item.id = item.id || null; 
            }
            this.updateDonutChart();

            this.itemAnalysisData = itemAnalysisData;

            this.meanValue = Math.round(this.correctResponses.reduce((sum, val) => sum + val, 0) / this.totalStudents);

          },
          (error) => {
            console.error('Error fetching Item Analysis with Item Numbers:', error);
          }
        );
  }
  
}
